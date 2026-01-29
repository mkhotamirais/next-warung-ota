"use server";

import prisma from "@/lib/prisma";
import { snap } from "@/lib/midtrans";
import { auth } from "@/auth";
import { PaymentDataProps } from "@/types/payment";
// import { SnapTransactionParameters } from "midtrans-client";
// import { EXPIRY_DURATION, EXPIRY_UNIT } from "@/lib/content";

/**
 * Membuat transaksi baru di Midtrans dan menyimpan Order di DB
 */
export async function midtransPayment({ addressId }: PaymentDataProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { token: null, orderId: null, error: "Unauthorized" };

    const userId = session.user.id;

    // Ambil item yang dicentang di keranjang
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        CartItem: {
          where: { isChecked: true },
          include: { Product: true },
        },
      },
    });

    if (!cart || cart.CartItem.length === 0) {
      return { token: null, orderId: null, error: "Silakan pilih item di keranjang" };
    }

    const totalAmount = cart.CartItem.reduce((acc, item) => acc + item.Product.price * item.quantity, 0);
    const externalId = `MID-${Date.now()}`;

    // Buat Order di Database
    await prisma.order.create({
      data: {
        totalAmount,
        status: "PENDING",
        gateway: "MIDTRANS",
        userId,
        externalId,
        addressId,
        OrderItem: {
          create: cart.CartItem.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.Product.price,
          })),
        },
      },
    });

    const parameter = {
      transaction_details: {
        order_id: externalId,
        gross_amount: totalAmount,
      },
      enabled_payments: ["qris", "gopay"],
      credit_card: { secure: true },
      // expiry: {
      //   unit: EXPIRY_UNIT,
      //   duration: EXPIRY_DURATION,
      // },
      item_details: cart.CartItem.map((item) => ({
        id: item.productId,
        price: item.Product.price,
        quantity: item.quantity,
        name: item.Product.name,
      })),
      // customer_details: { first_name: reservation.User.name, email: reservation.User.email },
    };

    // Cast aman: parameter divalidasi oleh interface kita, lalu di-cast ke tipe library
    const transaction = await snap.createTransaction(parameter);

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        isChecked: true,
      },
    });

    return { token: transaction.token, orderId: externalId, error: null };

    // return { token: transaction.token as string, orderId: externalId, error: null };
  } catch (error) {
    console.error("Midtrans Error:", error);
    return { token: null, orderId: null, error: "Gagal memproses pembayaran" };
  }
}

export async function cancelOrderManual(orderId: string) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  await prisma.order.update({
    where: {
      id: orderId, // Menggunakan ID internal Prisma
      userId: session.user.id,
    },
    data: { status: "CANCELED" }, // Jangan dihapus, cukup ubah statusnya
  });

  return { success: true };
}
