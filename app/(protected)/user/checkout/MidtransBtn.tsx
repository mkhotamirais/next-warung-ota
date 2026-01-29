"use client";

import Script from "next/script";
import { toast } from "sonner";
import { midtransPayment } from "@/actions/payments/midtrans-payment";
import { PaymentDataProps, PaymentProps } from "@/types/payment";
import { Button } from "@/components/ui/button";

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
        },
      ) => void;
    };
  }
}

export default function MidtransBtn({ addressId }: PaymentDataProps) {
  const handlePay = async () => {
    const toastId = toast.loading("Menyiapkan transaksi...");

    const { token, error } = await midtransPayment({ addressId });

    if (error || !token) {
      toast.error(error || "Gagal memulai pembayaran", { id: toastId });
      return;
    }

    toast.dismiss(toastId);

    window.snap.pay(token, {
      onSuccess: (result) => {
        toast.success("Pembayaran Berhasil!");
        // Sesuaikan dengan route baru dan sertakan transaction_status
        window.location.href = `/user/payment/success?order_id=${result.order_id}&transaction_status=${result.transaction_status}`;
      },
      onPending: (result) => {
        toast.info("Pesanan disimpan. Segera selesaikan pembayaran.");
        window.location.href = `/user/payment/pending?order_id=${result.order_id}`;
      },
      onError: (result) => {
        toast.error("Pembayaran gagal.");
        window.location.href = `/user/payment/failure?order_id=${result.order_id}`;
      },
      onClose: () => {
        toast.info("Pembayaran ditunda.");
        // Tetap ke my-orders tidak masalah jika user menutup popup tanpa aksi
        window.location.href = "/user/my-orders";
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
      <Button type="button" onClick={handlePay}>
        Bayar Pakai Midtrans
      </Button>
    </>
  );
}
