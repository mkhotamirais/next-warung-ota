"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ChangePasswordSchema, DeleteAccountSchema, ProfileDataSchema } from "@/lib/zod";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { compare, hash } from "bcrypt-ts";
import { Address, Prisma } from "@/lib/generated/prisma";
import { AddressSchema } from "@/lib/zod";
import { SignupSchema } from "@/lib/zod";
import { hashSync } from "bcrypt-ts";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailVerification(email: string, userId?: string) {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 3600 * 1000);

    // 1. Hapus token lama dan buat yang baru
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({ data: { identifier: email, token: token, expires: expires } });

    // 2. Buat URL Verifikasi menggunakan NEXTAUTH_URL
    const baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      throw new Error("NEXTAUTH_URL not set in environment.");
    }
    const verificationUrl = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userName = user?.name || "Pengguna";

    // 3. Kirim Email melalui Resend
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@warungota.com",
      to: email,
      subject: "Verifikasi Alamat Email Anda",
      html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2>Verifikasi Email Akun Anda</h2>
                    <p>Halo ${userName},</p>
                    <p>Terima kasih telah mendaftar. Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda:</p>
                    <a 
                        href="${verificationUrl}" 
                        style="display: inline-block; padding: 10px 20px; margin: 15px 0; background-color: #1d4ed8; color: white; text-decoration: none; border-radius: 5px;"
                        target="_blank"
                    >
                        Verifikasi Email
                    </a>
                    <p style="font-size: 12px; color: #777;">Tautan ini akan kedaluwarsa dalam 24 jam.</p>
                </div>
            `,
    });

    if (result.error) {
      console.error("Resend Error:", result.error);
      throw new Error(`Failed to send email: ${result.error.message}`);
    }
  } catch (error) {
    console.error("Email verification send process error:", error);
    throw new Error("Failed to send verification email. Please try again.");
  }
}

export async function sendEmailChangeVerification(newEmail: string, userId: string) {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const baseUrl = process.env.NEXTAUTH_URL;

    if (!baseUrl) {
      throw new Error("NEXTAUTH_URL not set in environment.");
    }

    await prisma.user.update({ where: { id: userId }, data: { emailChangeVerificationToken: token } });

    // URL diarahkan ke halaman client untuk verifikasi POST
    const verificationUrl = `${baseUrl}/verify-email-change?token=${token}&userId=${userId}`;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userName = user?.name || "Pengguna";

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "test@example.com",
      to: newEmail,
      subject: "Konfirmasi Perubahan Alamat Email Anda",
      html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2>Konfirmasi Email Baru Akun Anda</h2>
                    <p>Halo ${userName},</p>
                    <p>Anda telah meminta perubahan alamat email. Silakan klik tombol di bawah ini untuk mengkonfirmasi alamat email baru Anda (${newEmail}):</p>
                    <a 
                        href="${verificationUrl}" 
                        style="display: inline-block; padding: 10px 20px; margin: 15px 0; background-color: #1d4ed8; color: white; text-decoration: none; border-radius: 5px;"
                        target="_blank"
                    >
                        Konfirmasi Email Baru
                    </a>
                    <p style="font-size: 12px; color: #777;">Jika Anda tidak meminta perubahan ini, abaikan email ini.</p>
                </div>
            `,
    });

    if (result.error) {
      console.error("Resend Error:", result.error);
      throw new Error(`Failed to send email: ${result.error.message}`);
    }
  } catch (error) {
    console.error("Email change verification send process error:", error);
    throw new Error("Failed to send verification email for change. Please try again.");
  }
}

type ProfileUpdateData = z.infer<typeof ProfileDataSchema>;

const normalizeValue = (value: string | null | undefined): string | null | undefined => {
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
};

// ---------- PROFILE ----------
// PUT /api/account/profile
export async function updateProfileData(data: ProfileUpdateData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return { error: "Unauthorized" };

  const userId = session.user.id;
  const validatedFields = ProfileDataSchema.safeParse(data);

  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  const { name, email: newEmail, phone: inputPhone } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found" };

    const updates: Prisma.UserUpdateInput = {};
    let emailChangePending = false;

    const normalizedInputPhone = normalizeValue(inputPhone);
    const normalizedUserPhone = normalizeValue(user.phone);

    if (name !== user.name) {
      updates.name = name;
    }

    if (normalizedInputPhone !== normalizedUserPhone) {
      if (normalizedInputPhone !== null) {
        const duplicatePhoneNumber = await prisma.user.findFirst({
          where: { phone: normalizedInputPhone, id: { not: userId } },
        });

        if (duplicatePhoneNumber) return { error: "Phone number is already in use" };
      }

      updates.phone = normalizedInputPhone;
    }

    if (newEmail && newEmail !== user.email) {
      const existingUserWithEmail = await prisma.user.findFirst({
        where: { OR: [{ email: newEmail }, { pendingEmail: newEmail }] },
      });

      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        return { error: "Email is already in use or pending verification" };
      }

      await prisma.user.update({
        where: { id: userId },
        data: { pendingEmail: newEmail, emailVerified: null },
      });

      emailChangePending = true;

      await sendEmailChangeVerification(newEmail, userId);
    }

    if (Object.keys(updates).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: updates });
    }

    revalidatePath("/account/profile");

    if (emailChangePending) {
      return { message: "Verification email sent to new address. Please check your inbox." };
    }

    return { message: "Account updated successfully" };
  } catch (error) {
    console.error("Server Action updateProfileData error:", error);
    return { error: "Internal Server Error" };
  }
}

type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;

// PATCH /api/account/profile
export async function profileChangePassword(data: ChangePasswordData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;
  const validatedFields = ChangePasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } });

    if (!user || !user.password) return { error: "User tidak ditemukan atau password tidak diatur" };

    const isPasswordValid = await compare(currentPassword, user.password);

    if (!isPasswordValid) return { error: "Password lama salah" };

    const newHashedPassword = await hash(newPassword, 10);

    await prisma.user.update({ where: { id: userId }, data: { password: newHashedPassword } });

    return { message: "Password berhasil diubah" };
  } catch (error) {
    console.error("Server Action profileChangePassword error:", error);
    return { error: "Internal Server Error" };
  }
}

// DELETE /api/account/profile
export async function profileDeleteAccount(data: { text: string }) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;
  const validatedFields = DeleteAccountSchema.safeParse(data);

  if (!validatedFields.success) return { errors: z.treeifyError(validatedFields.error).properties };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { Cart: { userId: userId } } });
      await tx.orderItem.deleteMany({ where: { Order: { userId: userId } } });
      await tx.blog.deleteMany({ where: { userId: userId } });
      await tx.product.deleteMany({ where: { userId: userId } });
      await tx.cart.deleteMany({ where: { userId: userId } });
      await tx.order.deleteMany({ where: { userId: userId } });
      await tx.account.deleteMany({ where: { userId: userId } });
      await tx.passwordResetToken.deleteMany({ where: { userId: userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    return { message: "Akun dan semua data terkait berhasil dihapus secara permanen." };
  } catch (error) {
    console.error("Server Action profileDeleteAccount error:", error);

    return { error: "Terjadi kesalahan server saat memproses penghapusan akun. Beberapa data mungkin gagal dihapus." };
  }
}

interface GetAddressesParams {
  limit?: number;
  page?: number;
}

// ---------- ADDRESS ----------
// GET /api/account/address
export const getAddresses = async ({ limit = 8, page = 1 }: GetAddressesParams) => {
  const session = await auth();
  const userId = session?.user?.id as string;

  const skip = (page - 1) * limit;
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    take: limit,
    skip: skip,
  });
  const totalAddressCount = await prisma.address.count({ where: { userId } });
  const totalPages = Math.ceil(totalAddressCount / limit);

  return { addresses, totalPages, totalAddressCount };
};

// GET /api/account/address/:id
export const getAddressById = async (id: string): Promise<Address | null> => {
  try {
    const session = await auth();
    const userId = session?.user?.id as string;
    const address = await prisma.address.findFirst({
      where: { userId, id },
      orderBy: { updatedAt: "desc" },
    });
    return address;
  } catch (error) {
    console.log(error);
    return null;
  }
};

type AddressInputData = z.infer<typeof AddressSchema>;
// POST /api/account/address
export async function createAddress(data: AddressInputData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;
  const validatedFields = AddressSchema.safeParse(data);

  if (!validatedFields.success) return { errors: z.treeifyError(validatedFields.error).properties };

  const { isDefault, ...addressData } = validatedFields.data;
  const cleanData = { ...addressData, label: addressData.label || "Alamat Baru" };
  const defaultStatus = isDefault ?? false;

  try {
    const newAddress = await prisma.$transaction(async (tx) => {
      const addressCount = await tx.address.count({ where: { userId } });
      const isFirstAddress = addressCount === 0;
      const newIsDefault = isFirstAddress || defaultStatus;

      if (newIsDefault && !isFirstAddress) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return await tx.address.create({
        data: { ...cleanData, userId, isDefault: newIsDefault },
      });
    });

    revalidatePath("/dashboard/account/address");
    return { message: "Alamat baru berhasil ditambahkan.", address: newAddress };
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") return { error: "Label alamat sudah digunakan." };
    }
    return { error: "Terjadi kesalahan server saat menyimpan alamat." };
  }
}

// PUT /api/account/address/:id
export async function updateAddress(id: string, data: AddressInputData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;
  const validatedFields = AddressSchema.safeParse(data);

  if (!validatedFields.success) return { errors: z.treeifyError(validatedFields.error).properties };

  const { isDefault, ...updateData } = validatedFields.data;
  const defaultStatus = isDefault ?? false;

  try {
    const updatedAddress = await prisma.$transaction(async (tx) => {
      const existingAddress = await tx.address.findFirst({
        where: { userId, id },
        select: { id: true, isDefault: true },
      });

      if (!existingAddress) throw new Error("NOT_FOUND");

      if (defaultStatus && !existingAddress.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return await tx.address.update({
        where: { id: existingAddress.id },
        data: { ...updateData, isDefault: defaultStatus },
      });
    });

    revalidatePath("/dashboard/account/address");
    return { message: "Alamat berhasil diperbarui.", address: updatedAddress };
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return { error: "Alamat tidak ditemukan." };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Label alamat sudah digunakan." };
    }
    return { error: "Terjadi kesalahan server saat memperbarui alamat." };
  }
}

// DELETE /api/account/address/:id
export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      const addressToDelete = await tx.address.findFirst({ where: { userId, id } });
      if (!addressToDelete) throw new Error("NOT_FOUND");

      await tx.address.delete({ where: { id: addressToDelete.id } });

      if (addressToDelete.isDefault) {
        const remainingAddress = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: "asc" },
        });
        if (remainingAddress) {
          await tx.address.update({
            where: { id: remainingAddress.id },
            data: { isDefault: true },
          });
        }
      }
    });

    revalidatePath("/dashboard/account/address");
    return { message: "Alamat berhasil dihapus." };
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return { error: "Alamat tidak ditemukan." };
    }
    return { error: "Terjadi kesalahan server saat menghapus alamat." };
  }
}

// ---------- SIGNUP ----------
// POST /api/account/signup
export async function signup(data: z.infer<typeof SignupSchema>) {
  const validatedFields = SignupSchema.safeParse(data);
  if (!validatedFields.success) return { errors: z.treeifyError(validatedFields.error).properties };

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) return { error: `Email '${email}' sudah terdaftar.` };

    const hashedPassword = hashSync(password, 10);

    const user = await prisma.user.create({ data: { name, email, password: hashedPassword, emailVerified: null } });

    await sendEmailVerification(email, user.id);

    return { message: "Pendaftaran berhasil. Silakan cek email Anda untuk verifikasi." };
  } catch (error) {
    console.log(error);
    return { error: "Terjadi kesalahan server saat melakukan pendaftaran." };
  }
}

// ---------- PASSWORD RESET ----------
const generateToken = () => {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    expires: new Date(Date.now() + 3600 * 1000),
  };
};

export async function resetPasswordRequest(data: { email: string }) {
  const { email } = data;
  if (!email) return { error: "Email required" };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: "Jika email terdaftar, tautan reset telah dikirim." };

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
      html: `<p>Anda meminta reset password. Klik tautan berikut dalam 1 jam:</p><p><a href="${resetLink}">Reset Password</a></p>`,
    });

    return { message: "Jika email terdaftar, tautan reset telah dikirim." };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error." };
  }
}

const SALT_ROUNDS = 10;

export async function resetPassword(data: { token: string | null; email: string | null; newPassword: string }) {
  const { token, email, newPassword } = data;

  if (!token || !email || !newPassword || newPassword.length < 8) {
    return { error: "Input tidak valid. Pastikan password minimal 8 karakter." };
  }

  try {
    const resetToken = await prisma.passwordResetToken.findFirst({ where: { token: token, User: { email: email } } });

    if (!resetToken) return { error: "Tautan reset tidak valid atau sudah digunakan." };

    if (resetToken.expires < new Date()) return { error: "Tautan reset sudah kedaluwarsa." };

    const hashedPassword = await hash(newPassword, SALT_ROUNDS);

    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashedPassword } }),
      prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
    ]);

    return { message: "Password berhasil direset! Anda akan dialihkan ke halaman login." };
  } catch (error) {
    console.log(error);
    return { error: "Terjadi kesalahan server saat mereset password." };
  }
}
