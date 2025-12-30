"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getCheckoutData() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const userId = session.user.id as string;

  try {
    // 1. Ambil Alamat User
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" }, // Default alamat muncul paling atas
    });

    // 2. Ambil Item Keranjang yang dicentang saja
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        CartItem: {
          where: { isChecked: true }, // Filter hanya yang dicentang
          include: { Product: true },
        },
      },
    });

    if (!cart || cart.CartItem.length === 0) {
      return { error: "No items to checkout" };
    }

    const subtotal = cart.CartItem.reduce((acc, item) => acc + item.quantity * item.Product.price, 0);

    return {
      addresses,
      checkoutItems: cart.CartItem,
      subtotal,
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch checkout data" };
  }
}
