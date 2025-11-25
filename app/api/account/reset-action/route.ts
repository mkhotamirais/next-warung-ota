import prisma from "@/lib/prisma";
import { hash } from "bcrypt-ts";

const SALT_ROUNDS = 10;

export const POST = async (req: Request) => {
  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword || newPassword.length < 8) {
      return Response.json({ message: "Input tidak valid. Pastikan password minimal 8 karakter." }, { status: 400 });
    }

    // 1. Cari token di database (mencocokkan token DAN email pengguna)
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: token,
        User: { email: email },
      },
    });

    if (!resetToken) {
      return Response.json({ message: "Tautan reset tidak valid atau sudah digunakan." }, { status: 400 });
    }

    // 2. Cek masa kedaluwarsa
    if (resetToken.expires < new Date()) {
      return Response.json({ message: "Tautan reset sudah kedaluwarsa." }, { status: 400 });
    }

    // 3. Hash Password Baru
    const hashedPassword = await hash(newPassword, SALT_ROUNDS);

    // 4. Update User dan Hapus Token dalam satu transaksi
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    return Response.json({ message: "Password berhasil direset! Silakan Login." }, { status: 200 });
  } catch (error) {
    console.error("Reset password failed:", error);
    return Response.json({ message: "Terjadi kesalahan server saat mereset password." }, { status: 500 });
  }
};
