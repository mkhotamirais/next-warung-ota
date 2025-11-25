import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ChangePasswordSchema } from "@/lib/zod";
import { compare, hash } from "bcrypt-ts";
import { z } from "zod";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  const validatedFields = ChangePasswordSchema.safeParse(body);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } });

    if (!user || !user.password) {
      return Response.json({ error: "User or current password not configured for change" }, { status: 404 });
    }

    const isPasswordValid = await compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return Response.json({ error: "Password lama salah" }, { status: 400 });
    }

    const newHashedPassword = await hash(newPassword, 10);

    await prisma.user.update({ where: { id: userId }, data: { password: newHashedPassword } });

    return Response.json({ message: "Password berhasil diubah" }, { status: 200 });
  } catch (error) {
    console.error("API Change Password error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
