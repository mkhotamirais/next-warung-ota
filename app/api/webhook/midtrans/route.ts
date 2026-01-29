import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { order_id, transaction_status, fraud_status, status_code, gross_amount, signature_key } = body;

    // 1. Verifikasi Signature (Keamanan)
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const hashed = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (hashed !== signature_key) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 403 });
    }

    // 2. Cari Order di Database
    const order = await prisma.order.findUnique({
      where: { externalId: order_id },
      include: { OrderItem: true }, // Sertakan item untuk urusan stok
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. Logika Perubahan Status
    // STATUS: PAID
    if (transaction_status === "settlement" || transaction_status === "capture") {
      if (fraud_status === "accept" || !fraud_status) {
        await prisma.order.update({
          where: { externalId: order_id },
          data: { status: "PAID" },
        });
      }
    }

    // STATUS: CANCELED (Expire, Cancel, atau Deny)
    else if (["expire", "cancel", "deny"].includes(transaction_status)) {
      // Update status order menjadi CANCELED
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { externalId: order_id },
          data: { status: "CANCELED" },
        });

        // Kembalikan stok produk
        for (const item of order.OrderItem) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
      });
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
