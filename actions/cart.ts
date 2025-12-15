"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const revalidateCart = () => {
  revalidatePath("/product/cart");
};

export const addProductToCart = async ({ productId, qty: quantity }: { productId: string; qty: number }) => {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "USER") {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id as string;

  if (!productId || typeof quantity !== "number" || quantity < 1) {
    return { error: "Invalid product ID or quantity" };
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return { error: "Product not found" };
    }

    // 1. PASTIKAN CART ADA (Upsert Cart):
    // Cari keranjang, jika tidak ada, buat keranjang baru untuk user ini.
    // Ini menyelesaikan Masalah #1 (cart mungkin null)
    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {}, // Tidak ada yang diupdate jika sudah ada
      create: { userId }, // Buat jika belum ada
      include: { CartItem: true }, // Include CartItem untuk perhitungan nanti
    });

    const existingCartItem = cart.CartItem.find((item) => item.productId === productId);

    let updatedOrNewItem;

    if (existingCartItem) {
      // Item sudah ada, update kuantitas
      updatedOrNewItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity, isChecked: true },
      });
    } else {
      // Item belum ada, buat item baru
      updatedOrNewItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId: productId, quantity: quantity, isChecked: true },
      });
    }

    // 2. PERBAIKI PERHITUNGAN TOTAL KUANTITAS (Masalah #2):
    // Untuk mendapatkan total kuantitas yang AKURAT setelah perubahan,
    // kita perlu melakukan fetch ulang atau menghitung total dari database.

    // Cara paling aman: Hitung ulang total kuantitas dari database
    const totalQtyResult = await prisma.cartItem.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        cartId: cart.id,
      },
    });

    const cartQty = totalQtyResult._sum.quantity || 0;

    revalidateCart();

    return {
      message: existingCartItem ? "Item updated" : "Item added",
      item: updatedOrNewItem,
      cartQty,
    };
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return { error: "Internal server error" };
  }
};

export const getCart = async () => {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "USER") {
      return { cartItems: [], cartQty: 0, totalPrice: 0, error: "Unauthorized" };
    }

    const userId = session.user.id as string;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { CartItem: { include: { Product: true } } },
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
