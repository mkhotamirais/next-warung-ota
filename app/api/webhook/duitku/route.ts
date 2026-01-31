import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // Duitku mengirim data dalam format x-www-form-urlencoded
    const formData = await req.formData();
    const merchantCode = formData.get("merchantCode") as string;
    const amount = formData.get("amount") as string;
    const merchantOrderId = formData.get("merchantOrderId") as string;
    const signature = formData.get("signature") as string;
    const resultQuality = formData.get("resultCode") as string; // '00' berarti sukses

    // 1. Validasi Signature
    const payload = merchantCode + amount + merchantOrderId + process.env.DUITKU_API_KEY;
    const calcSignature = crypto.createHash("md5").update(payload).digest("hex");

    if (signature !== calcSignature) {
      return new Response("Bad Signature", { status: 400 });
    }

    // 2. Cek apakah pembayaran sukses
    if (resultQuality === "00") {
      console.log(`Pesanan ${merchantOrderId} LUNAS!`);

      // DISINI: Tambahkan logika update database dan kirim pulsa otomatis
    }

    // 3. Duitku wajib menerima respon "OK" agar tidak mengirim ulang callback
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
