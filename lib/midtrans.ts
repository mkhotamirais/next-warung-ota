import Midtrans from "midtrans-client";

const isProd = process.env.NODE_ENV === "production";

export const snap = new Midtrans.Snap({
  isProduction: isProd,
  serverKey: isProd ? process.env.MIDTRANS_SERVER_KEY_PROD! : process.env.MIDTRANS_SERVER_KEY!,
  clientKey: isProd ? process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY_PROD! : process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});
