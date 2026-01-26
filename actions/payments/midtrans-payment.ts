"use server";

import prisma from "@/lib/prisma";
import { snap } from "@/lib/midtrans";
import { auth } from "@/auth";
import { MidtransTransactionParameters, PaymentDataProps } from "@/types/payment";
import { SnapTransactionParameters } from "midtrans-client";

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

    const parameter: MidtransTransactionParameters = {
      transaction_details: {
        order_id: externalId,
        gross_amount: totalAmount,
      },
      item_details: cart.CartItem.map((item) => ({
        id: item.productId,
        price: item.Product.price,
        quantity: item.quantity,
        name: item.Product.name,
      })),
    };

    // Cast aman: parameter divalidasi oleh interface kita, lalu di-cast ke tipe library
    const transaction = await snap.createTransaction(parameter as unknown as SnapTransactionParameters);

    return { token: transaction.token as string, orderId: externalId, error: null };
  } catch (error) {
    console.error("Midtrans Error:", error);
    return { token: null, orderId: null, error: "Gagal memproses pembayaran" };
  }
}

/**
 * Menghapus order jika user membatalkan pembayaran (Close popup)
 */
export async function midtransCancelOrder(externalId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    await prisma.order.delete({
      where: {
        externalId,
        status: "PENDING", // Proteksi agar tidak menghapus order yang sudah dibayar
        userId: session.user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.log("error deleting order:", error);
    // Biasanya error terjadi jika order sudah tidak ada (race condition)
    return { success: false };
  }
}
