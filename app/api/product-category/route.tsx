import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductCategorySchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateProductCategory = () => {
  revalidatePath("/dashboard/admin/product-category");
  revalidatePath("/dashboard/admin/product/create-product");
};

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const rawData = await req.json();
  const validatedFields = ProductCategorySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) });
  }

  const { name, slug } = validatedFields.data;

  if (await prisma.productCategory.findUnique({ where: { slug } })) {
    return Response.json({ error: `Product category "${name}" already exists` }, { status: 409 });
  }

  try {
    await prisma.productCategory.create({ data: { name, slug } });
    revalidateProductCategory();
    return Response.json({ message: `Product category "${name}" created successfully` });
  } catch (error) {
    console.log(error);
  }
};
