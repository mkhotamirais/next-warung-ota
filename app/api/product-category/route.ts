import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductCategorySchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateProductCategory = () => {
  revalidatePath("/dashboard/admin/product-category");
  revalidatePath("/dashboard/admin/product/create-product");
};

export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return Response.json(categories);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedFields = ProductCategorySchema.safeParse(body);

    if (!validatedFields.success) {
      return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
    }

    const { name, slug } = validatedFields.data;

    const existing = await prisma.productCategory.findUnique({ where: { slug } });
    if (existing) {
      return Response.json({ error: `Product category "${name}" already exists` }, { status: 400 });
    }

    await prisma.productCategory.create({ data: { name, slug } });
    revalidateProductCategory();

    return Response.json({ message: `Product category "${name}" created successfully` }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
