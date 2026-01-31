import crypto from "crypto";

const isProd = process.env.NODE_ENV === "production";
const merchantCode = isProd ? process.env.DUITKU_MERCHANT_CODE_PROD : process.env.DUITKU_MERCHANT_CODE;
const apiKey = isProd ? process.env.DUITKU_API_KEY_PROD : process.env.DUITKU_API_KEY;

export function createDuitkuSignature(orderId: string, amount: number) {
  const data = merchantCode + orderId + amount + apiKey;
  return crypto.createHash("md5").update(data).digest("hex");
}
