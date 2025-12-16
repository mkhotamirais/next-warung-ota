"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ChangePasswordSchema, DeleteAccountSchema, ProfileDataSchema } from "@/lib/zod";
import { sendEmailChangeVerification } from "@/actions/send-verification";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma";
import { compare, hash } from "bcrypt-ts";

type ProfileUpdateData = z.infer<typeof ProfileDataSchema>;

const normalizeValue = (value: string | null | undefined): string | null | undefined => {
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
};

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
