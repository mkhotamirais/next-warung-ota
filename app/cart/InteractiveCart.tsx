"use client";

import { useRouter } from "next/navigation";
import { CartItemProps } from "@/types/types";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import CartList from "./CartList";
import { useEffect } from "react";
import { formatRupiah } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { upsertCartItem, deleteCartItem } from "@/actions/cart";

interface InteractiveCartProps {
  cartItems: CartItemProps[];
  cartQty: number;
  totalPrice: number;
}

export default function InteractiveCart({ cartItems, cartQty, totalPrice }: InteractiveCartProps) {
  const router = useRouter();
  const { setCartQty, setPendingSaving, setPendingSave, setPendingDel, pendingCheckout, setPendingCheckout } =
    useCart();

  useEffect(() => {
    setCartQty(cartQty);
  }, [setCartQty, cartQty]);

  const handleUpdate = async (itemToUpdate: CartItemProps, newQty: number, newCheck: boolean | undefined) => {
    const isQtyUpdate = newQty !== itemToUpdate.quantity;
    const isCheckUpdate = typeof newCheck === "boolean" && newCheck !== itemToUpdate.isChecked;

    if (!isQtyUpdate && !isCheckUpdate) return;

    setPendingCheckout(true);
    setPendingSaving(itemToUpdate.Product.id);

    try {
      let res: Awaited<ReturnType<typeof upsertCartItem>>;

      if (isQtyUpdate) {
        res = await upsertCartItem({
          productId: itemToUpdate.Product.id,
          quantity: newQty,
          actionType: "SET",
          isChecked: true, // Dipaksa true jika kuantitas diubah
        });
      } else if (isCheckUpdate) {
        res = await upsertCartItem({
          productId: itemToUpdate.Product.id,
          actionType: "SET_CHECKED",
          isChecked: newCheck as boolean,
        });
      } else {
        return;
      }

      if (res.error) {
        if (res.error === "Unauthorized") {
          router.push("/signin");
          return;
        }
        toast.error(res.error);
        return;
      }

      toast.success(res.message);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui keranjang.");
    } finally {
      setTimeout(() => {
        setPendingCheckout(false);
        setPendingSaving(null);
        setPendingSave(null);
      }, 1500);
    }
  };

  const handleDeleteItem = async (productId: string) => {
    setPendingDel(productId);

    try {
      const res = await deleteCartItem(productId);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (res.cartQty !== undefined) {
        setCartQty(res.cartQty);
      }
      toast.success(res.message);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus item dari keranjang.");
    } finally {
      setTimeout(() => {
        setPendingDel(null);
      }, 1500);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <>
      <div className="">
        {cartItems?.length > 0 ? (
          cartItems.map((item) => (
            <CartList
              item={item}
              key={item.Product.id}
              handleUpdate={handleUpdate}
              handleDeleteItem={handleDeleteItem}
            />
          ))
        ) : (
          <div className="text-center p-8 text-gray-500">
            Keranjang kamu kosong.
            <Link href="/" className="underline ml-2">
              Belanja sekarang!
            </Link>
          </div>
        )}
      </div>
      {cartItems?.length > 0 && (
        <div className="sticky bottom-0 py-4 border-t border-gray-300 flex items-center justify-between bg-white">
          <div className="flex flex-col">
            <p>Total Price</p>
            <p className="font-semibold">
              <span className="text-sm">Rp</span>
              <span>{formatRupiah(totalPrice)}</span>
            </p>
          </div>
          <div>
            <Button onClick={handleCheckout} disabled={pendingCheckout || totalPrice === 0 || cartItems.length === 0}>
              Checkout
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
