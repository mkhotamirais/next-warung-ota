import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { AddressSchema } from "@/lib/zod";
import { Prisma } from "@/lib/generated/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "8");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const [addresses, totalAddressCount] = await Promise.all([
      prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
        take: limit,
        skip,
      }),
      prisma.address.count({ where: { userId: session.user.id } }),
    ]);

    const totalPages = Math.ceil(totalAddressCount / limit);

    return Response.json({ addresses, totalPages, totalAddressCount });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validatedFields = AddressSchema.safeParse(body);

    if (!validatedFields.success) {
      return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
    }

    const userId = session.user.id;
    const { isDefault, ...addressData } = validatedFields.data;
    const cleanData = { ...addressData, label: addressData.label || "Alamat Baru" };
    const defaultStatus = isDefault ?? false;

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
    return Response.json({ message: "Alamat baru berhasil ditambahkan.", address: newAddress }, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "Label alamat sudah digunakan." }, { status: 409 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
