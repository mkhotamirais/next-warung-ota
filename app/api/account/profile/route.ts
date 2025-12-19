import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ChangePasswordSchema, DeleteAccountSchema, ProfileDataSchema } from "@/lib/zod";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { compare, hash } from "bcrypt-ts";
import { Prisma } from "@/lib/generated/prisma";
import { sendEmailChangeVerification } from "@/actions/account";

const normalizeValue = (value: string | null | undefined): string | null | undefined => {
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
};

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const validatedFields = ProfileDataSchema.safeParse(body);

    if (!validatedFields.success) {
      return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
    }

    const { name, email: newEmail, phone: inputPhone } = validatedFields.data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const updates: Prisma.UserUpdateInput = {};
    let emailChangePending = false;

    const normalizedInputPhone = normalizeValue(inputPhone);
    const normalizedUserPhone = normalizeValue(user.phone);

    if (name !== user.name) updates.name = name;

    if (normalizedInputPhone !== normalizedUserPhone) {
      if (normalizedInputPhone !== null) {
        const duplicatePhoneNumber = await prisma.user.findFirst({
          where: { phone: normalizedInputPhone, id: { not: userId } },
        });
        if (duplicatePhoneNumber) {
          return Response.json({ error: "Phone number is already in use" }, { status: 409 });
        }
      }
      updates.phone = normalizedInputPhone;
    }

    if (newEmail && newEmail !== user.email) {
      const existingUserWithEmail = await prisma.user.findFirst({
        where: { OR: [{ email: newEmail }, { pendingEmail: newEmail }] },
      });

      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        return Response.json({ error: "Email is already in use" }, { status: 409 });
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

    return Response.json({
      message: emailChangePending
        ? "Verification email sent to new address. Please check your inbox."
        : "Account updated successfully",
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const validatedFields = ChangePasswordSchema.safeParse(body);

    if (!validatedFields.success) {
      return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
    }

    const { currentPassword, newPassword } = validatedFields.data;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user || !user.password) {
      return Response.json({ error: "User not found or password not set" }, { status: 404 });
    }

    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return Response.json({ error: "Password lama salah" }, { status: 400 });
    }

    const newHashedPassword = await hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });

    return Response.json({ message: "Password berhasil diubah" });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const validatedFields = DeleteAccountSchema.safeParse(body);

    if (!validatedFields.success) {
      return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { Cart: { userId } } });
      await tx.orderItem.deleteMany({ where: { Order: { userId } } });
      await tx.blog.deleteMany({ where: { userId } });
      await tx.product.deleteMany({ where: { userId } });
      await tx.cart.deleteMany({ where: { userId } });
      await tx.order.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });
      await tx.passwordResetToken.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    return Response.json({ message: "Akun dan semua data terkait berhasil dihapus." });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
