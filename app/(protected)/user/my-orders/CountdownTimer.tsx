"use client";

import { EXPIRY_DURATION } from "@/lib/content";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { autoCancelOrder } from "@/actions/order";
// import { autoCancelOrder } from "@/app/actions/order-actions";

export function CountdownTimer({ createdAt, orderId }: { createdAt: Date; orderId: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false); // Guard agar tidak loop
  const router = useRouter();

  useEffect(() => {
    // Jika sudah ditandai expired, berhenti
    if (isExpired) return;

    const calculateTime = async () => {
      const expiryDate = new Date(new Date(createdAt).getTime() + EXPIRY_DURATION * 60 * 1000);
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true); // Kunci agar tidak masuk ke sini lagi
        setTimeLeft("Waktu Habis");

        try {
          await autoCancelOrder(orderId);
          router.refresh();
        } catch (error) {
          console.error("Gagal membatalkan pesanan otomatis:", error);
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();

    return () => clearInterval(timer);
  }, [createdAt, orderId, router, isExpired]); // Masukkan isExpired ke dependency

  return <span className="font-mono text-orange-600 font-medium text-xs">{timeLeft}</span>;
}
