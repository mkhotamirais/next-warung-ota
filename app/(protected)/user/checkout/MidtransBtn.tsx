"use client";

import Script from "next/script";
import { toast } from "sonner";
import { midtransPayment, midtransCancelOrder } from "@/actions/payments/midtrans-payment";
import { PaymentDataProps, PaymentProps } from "@/types/payment";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        callbacks: {
          onSuccess: (result: PaymentProps) => void;
          onPending: (result: PaymentProps) => void;
          onError: (result: PaymentProps) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

export default function MidtransBtn({ addressId }: PaymentDataProps) {
  const handlePay = async () => {
    const toastId = toast.loading("Menyiapkan transaksi...");

    const { token, orderId, error } = await midtransPayment({ addressId });

    if (error || !token) {
      toast.error(error || "Gagal memulai pembayaran", { id: toastId });
      return;
    }

    toast.dismiss(toastId);

    window.snap.pay(token, {
      onSuccess: (result) => {
        toast.success("Pembayaran Berhasil!");
        window.location.href = `/orders/success?id=${result.order_id}`;
      },
      onPending: () => {
        toast.info("Menunggu pembayaran Anda.");
      },
      onError: async () => {
        if (orderId) await midtransCancelOrder(orderId);
        toast.error("Pembayaran gagal, silakan coba lagi.");
      },
      onClose: async () => {
        if (orderId) {
          await midtransCancelOrder(orderId);
          toast.info("Pembayaran dibatalkan.");
        }
      },
    });
  };

  return (
    <>
      <Script
        src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <button
        type="button"
        onClick={handlePay}
        className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all"
      >
        Bayar Sekarang
      </button>
    </>
  );
}
