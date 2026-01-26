import prisma from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const generateToken = () => {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    expires: new Date(Date.now() + 3600 * 1000),
  };
};

export const POST = async (req: Request) => {
  const { email } = await req.json();
  if (!email) return Response.json({ error: "Email required" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return Response.json({ error: "Email salah atau belum terdaftar" });

    const { token, expires } = generateToken();
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${email}`;

    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: { token, expires },
      create: { userId: user.id, token, expires },
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Reset Password Warungota",
      html: `<p>Anda meminta reset password. Klik tautan berikut dalam 1 jam:</p><p><a target="_blank" href="${resetLink}">Reset Password</a></p>`,
    });

    return Response.json({ message: "Tautan reset telah dikirim, cek email anda!" }, { status: 200 });
  } catch (error) {
    console.error("Password reset error:", error);
    return Response.json({ message: "Internal server error." }, { status: 500 });
  }
};
