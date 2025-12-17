"use server";

import { auth } from "@/auth";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { AddressSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

interface GetAddressesParams {
  limit?: number;
  page?: number;
}

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

export const getAddressById = async (id: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id as string;
    const address = await prisma.address.findFirst({ where: { userId, id }, orderBy: { updatedAt: "desc" } });
    return address;
  } catch (error) {
    console.log(error);
  }
};

type AddressInputData = z.infer<typeof AddressSchema>;

export async function createAddress(data: AddressInputData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return { error: "Unauthorized" };

  const userId = session.user.id;
  const validatedFields = AddressSchema.safeParse(data);

  if (!validatedFields.success) return { errors: z.treeifyError(validatedFields.error).properties };

  const { isDefault, ...addressData } = validatedFields.data;

  const cleanData = { ...addressData, label: addressData.label || "Alamat Baru" };

  const defaultStatus = isDefault ?? false;
  let newAddress;

  try {
    await prisma.$transaction(async (tx) => {
      const addressCount = await tx.address.count({ where: { userId } });
      const isFirstAddress = addressCount === 0;

      const newIsDefault = isFirstAddress || defaultStatus;

      if (newIsDefault && !isFirstAddress) {
        await tx.address.updateMany({ where: { userId: userId, isDefault: true }, data: { isDefault: false } });
      }

      newAddress = await tx.address.create({ data: { ...cleanData, userId: userId, isDefault: newIsDefault } });
    });

    revalidatePath("/dashboard/account/address");

    if (!newAddress) {
      return { error: "Gagal membuat alamat dalam transaksi." };
    }

    return { message: "Alamat baru berhasil ditambahkan.", address: newAddress };
  } catch (error) {
    console.error("Server Action createAddress error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: "Anda sudah memiliki alamat dengan label ini. Pilih label lain." };
    }

    return { error: "Terjadi kesalahan server saat menyimpan alamat." };
  }
}

// type AddressInputData = z.infer<typeof AddressSchema>;

export async function updateAddress(id: string, data: AddressInputData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return { error: "Unauthorized" };

  const userId = session.user.id;
  const validatedFields = AddressSchema.safeParse(data);

  if (!validatedFields.success) return { errors: z.treeifyError(validatedFields.error).properties };

  const { isDefault, ...updateData } = validatedFields.data;
  const defaultStatus = isDefault ?? false;
  let updatedAddress: Prisma.AddressGetPayload<{}> | null = null;

  try {
    const transactionResult = await prisma.$transaction(async (tx) => {
      const existingAddress = await tx.address.findFirst({
        where: { userId, id: id },
        select: { id: true, isDefault: true },
      });

      if (!existingAddress) {
        return { error: "Alamat tidak ditemukan." };
      }

      if (defaultStatus && !existingAddress.isDefault) {
        await tx.address.updateMany({ where: { userId: userId, isDefault: true }, data: { isDefault: false } });
      }

      const address = await tx.address.update({
        where: { id: existingAddress.id },
        data: { ...updateData, isDefault: defaultStatus },
      });
      return address;
    });

    if (transactionResult && "error" in transactionResult) {
      return transactionResult;
    }
    updatedAddress = transactionResult as Prisma.AddressGetPayload<{}>;

    revalidatePath("/dashboard/account/address");

    if (updatedAddress) {
      return { message: "Alamat berhasil diperbarui.", address: updatedAddress };
    }

    return { error: "Alamat tidak ditemukan." };
  } catch (error) {
    console.error("Server Action updateAddress error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Alamat baru sudah digunakan. Pilih id yang unik." };
    }

    return { error: "Terjadi kesalahan server saat memperbarui alamat." };
  }
}

export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return { error: "Unauthorized" };

  const userId = session.user.id;
  let deletedAddress: Prisma.AddressGetPayload<{}> | null = null;

  try {
    const transactionResult = await prisma.$transaction(async (tx) => {
      const addressToDelete = await tx.address.findFirst({ where: { userId, id } });

      if (!addressToDelete) {
        return { error: "Alamat tidak ditemukan." };
      }

      const deleted = await tx.address.delete({ where: { id: addressToDelete.id } });

      if (addressToDelete.isDefault) {
        const remainingAddress = await tx.address.findFirst({ where: { userId }, orderBy: { createdAt: "asc" } });

        if (remainingAddress) {
          await tx.address.update({ where: { id: remainingAddress.id }, data: { isDefault: true } });
        }
      }
      return deleted;
    });

    if (transactionResult && "error" in transactionResult) {
      return transactionResult;
    }
    deletedAddress = transactionResult as Prisma.AddressGetPayload<{}>;

    revalidatePath("/dashboard/account/address");

    if (deletedAddress) {
      return { message: `Alamat berhasil dihapus.` };
    }

    return { error: "Alamat tidak ditemukan." };
  } catch (error) {
    console.error("Server Action deleteAddress error:", error);
    return { error: "Terjadi kesalahan server saat menghapus alamat." };
  }
}
