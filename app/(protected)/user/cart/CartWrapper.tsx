import InteractiveCart from "./InteractiveCart";
import { getCarts } from "@/actions/cart";
import { Button } from "@/components/ui/button-tmp";
import Link from "next/link";

export default async function CartWrapper() {
  const { cartQty, cartItems, totalPrice } = await getCarts();

  if (!cartItems || cartItems?.length === 0) {
    return (
      <>
        <p className="">Keranjang kamu masih kosong.</p>
        <Button asChild className="inline-block mt-2">
          <Link href="/">Belanja Sekarang</Link>
        </Button>
      </>
    );
  }

  const orderedCartItemsByChecked = [...cartItems].sort((a, b) => {
    if (a.isChecked === b.isChecked) return 0;
    return a.isChecked ? -1 : 1;
  });

  return <InteractiveCart cartItems={orderedCartItemsByChecked} cartQty={cartQty} totalPrice={totalPrice} />;
}
