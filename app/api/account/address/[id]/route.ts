import { auth } from "@/auth";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { AddressSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const address = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!address) return Response.json({ error: "Alamat tidak ditemukan." }, { status: 404 });

    return Response.json(address);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const validatedFields = AddressSchema.safeParse(body);

    if (!validatedFields.success) {
      return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
    }

    const userId = session.user.id;
    const { isDefault, ...updateData } = validatedFields.data;
    const defaultStatus = isDefault ?? false;

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
    return Response.json({ message: "Alamat berhasil diperbarui.", address: updatedAddress });
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return Response.json({ error: "Alamat tidak ditemukan." }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "Label alamat sudah digunakan." }, { status: 409 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const userId = session.user.id;

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
    return Response.json({ message: "Alamat berhasil dihapus." });
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return Response.json({ error: "Alamat tidak ditemukan." }, { status: 404 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
