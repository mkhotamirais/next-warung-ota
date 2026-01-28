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
        window.location.href = `/orders/success?id=${result.order_id}`;
      },
      onPending: () => {
        toast.info("Pesanan disimpan. Segera selesaikan pembayaran.");
        window.location.href = "/orders"; // Arahkan ke daftar pesanan
      },
      onError: () => {
        toast.error("Pembayaran gagal, silakan cek daftar pesanan.");
        window.location.href = "/orders";
      },
      onClose: () => {
        toast.info("Pembayaran ditunda.");
        window.location.href = "/orders"; // Tetap simpan sebagai PENDING
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
