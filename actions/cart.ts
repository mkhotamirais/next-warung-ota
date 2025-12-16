"use server";

import { auth } from "@/auth";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpsertCartItemParams {
  productId: string;
  quantity?: number;
  actionType: "INCREMENT" | "SET" | "SET_CHECKED";
  isChecked?: boolean;
}

const revalidateCart = () => {
  revalidatePath("/cart");
};

export async function upsertCartItem({ productId, quantity, actionType, isChecked }: UpsertCartItemParams) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "USER") return { error: "Unauthorized" };

  const userId = session.user.id as string;

  if (!productId) return { error: "Invalid product ID" };

  if ((actionType === "INCREMENT" || actionType === "SET") && (typeof quantity !== "number" || quantity < 1)) {
    return { error: "Invalid quantity for action" };
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return { error: "Product not found" };

    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: { CartItem: true },
    });

    const existingCartItem = cart.CartItem.find((item) => item.productId === productId);

    let updatedOrNewItem;
    let successMessage: string;

    if (actionType === "INCREMENT" || actionType === "SET") {
      const qtyToUse = quantity as number;

      if (existingCartItem) {
        const newQuantity = actionType === "INCREMENT" ? existingCartItem.quantity + qtyToUse : qtyToUse;

        updatedOrNewItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: newQuantity, isChecked: true },
        });
        successMessage = `Berhasil mengupdate ${product.name} menjadi ${newQuantity} di keranjang.`;
      } else {
        updatedOrNewItem = await prisma.cartItem.create({
          data: { cartId: cart.id, productId: productId, quantity: qtyToUse, isChecked: true },
        });
        successMessage = `Berhasil menambahkan ${qtyToUse} ${product.name} ke keranjang.`;
      }
    } else if (actionType === "SET_CHECKED") {
      if (!existingCartItem || typeof isChecked !== "boolean") {
        return { error: "Item tidak ditemukan atau status check tidak valid" };
      }

      updatedOrNewItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { isChecked: isChecked },
      });
      successMessage = `Status check ${product.name} berhasil diubah menjadi ${isChecked ? "Checked" : "Unchecked"}.`;
    } else {
      return { error: "Invalid action type" };
    }

    const totalQtyResult = await prisma.cartItem.aggregate({ _sum: { quantity: true }, where: { cartId: cart.id } });
    const cartQty = totalQtyResult._sum.quantity || 0;

    revalidateCart();

    return { message: successMessage, item: updatedOrNewItem, cartQty };
  } catch (error) {
    console.error("Error managing cart item:", error);
    return { error: "Internal server error" };
  }
}

export const getCarts = async () => {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "USER") {
      return { cartItems: [], cartQty: 0, totalPrice: 0, error: "Unauthorized" };
    }

    const userId = session.user.id as string;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { CartItem: { include: { Product: true }, orderBy: { updatedAt: "desc" } } },
    });

    if (!cart) {
      return { cartItems: [], cartQty: 0, totalPrice: 0, error: "Cart not found" };
    }

    const cartQty = cart.CartItem.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.CartItem.reduce((total, item) => {
      if (item.isChecked) {
        return total + item.quantity * item.Product.price;
      }
      return total;
    }, 0);

    return { cartItems: cart.CartItem, cartQty, totalPrice };
  } catch (error) {
    console.log(error);
    return { cartItems: [], cartQty: 0, totalPrice: 0, error: "Internal server error" };
  }
};

export async function deleteCartItem(productId: string) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "USER") return { error: "Unauthorized" };

  const userId = session.user.id as string;

  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { error: "Cart not found" };

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId: productId } });

    const totalQtyResult = await prisma.cartItem.aggregate({ _sum: { quantity: true }, where: { cartId: cart.id } });
    const cartQty = totalQtyResult._sum.quantity || 0;

    revalidateCart();

    return { message: "Item berhasil dihapus", cartQty };
  } catch (error) {
    console.error("Error deleting cart item:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      revalidateCart();
      return { message: "Item berhasil dihapus (atau sudah tidak ada)", cartQty: 0 };
    }
    return { error: "Internal server error" };
  }
}
