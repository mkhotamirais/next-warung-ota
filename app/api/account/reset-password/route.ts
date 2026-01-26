import prisma from "@/lib/prisma";
import { ResetPasswordSchema } from "@/lib/zod";
import { hash } from "bcrypt-ts";
import z from "zod";

const SALT_ROUNDS = 10;

export const POST = async (req: Request) => {
  try {
    const { token, email, newPassword, confirmNewPassword } = await req.json();

    if (!token || !email) return Response.json({ error: "Token, email harus ada." }, { status: 400 });

    // 1. Cari token di database (mencocokkan token DAN email pengguna)
    const resetToken = await prisma.passwordResetToken.findFirst({ where: { token: token, User: { email: email } } });
    if (!resetToken) return Response.json({ error: "Tautan reset tidak valid atau sudah digunakan." }, { status: 400 });

    // 2. Cek masa kedaluwarsa
    if (resetToken.expires < new Date())
      return Response.json({ error: "Tautan reset sudah kedaluwarsa." }, { status: 400 });

    // 3. Validasi Zod
    const validatedFields = ResetPasswordSchema.safeParse({ newPassword, confirmNewPassword });

    if (!validatedFields.success) {
      return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
    }

    // 4. Hash Password Baru
    const hashedPassword = await hash(newPassword, SALT_ROUNDS);

    // 5. Update User dan Hapus Token dalam satu transaksi
    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashedPassword } }),
      prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
    ]);

    return Response.json(
      { message: "Password berhasil direset! Anda akan dialihkan ke halaman login." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password failed:", error);
    return Response.json({ message: "Terjadi kesalahan server saat mereset password." }, { status: 500 });
  }
};
