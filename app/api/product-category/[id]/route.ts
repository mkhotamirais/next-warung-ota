import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductCategorySchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateProductCategory = () => {
  revalidatePath("/dashboard/admin/product-category");
  revalidatePath("/dashboard/admin/product/create-product");
};

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const session = await auth();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const categoryToDelete = await prisma.productCategory.findUnique({ where: { id } });
  if (!categoryToDelete) {
    return Response.json({ error: "Product category not found" }, { status: 404 });
  }

  if (categoryToDelete.isDefault) {
    return Response.json({ error: "Default product category cannot be deleted" }, { status: 400 });
  }

  try {
    const postCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (postCount > 0) {
      const defaultCategory = await prisma.productCategory.findFirst({ where: { isDefault: true } });

      if (!defaultCategory) {
        return Response.json({ error: "Default category not found" }, { status: 500 });
      }

      await prisma.$transaction(async (tx) => {
        await tx.product.updateMany({ where: { categoryId: id }, data: { categoryId: defaultCategory.id } });
        await tx.productCategory.delete({ where: { id } });
      });

      revalidateProductCategory();

      return Response.json({
        message: `Product category "${categoryToDelete.name}" deleted successfully. ${postCount} associated posts have been moved to "${defaultCategory.name}".`,
      });
    } else {
      await prisma.productCategory.delete({ where: { id } });

      revalidateProductCategory();

      return Response.json({ message: `Product category "${categoryToDelete.name}" deleted successfully.` });
    }
  } catch (error) {
    console.log(error);
  }
};

export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const session = await auth();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const rawData = await req.json();
  const validatedFields = ProductCategorySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) });
  }

  const { name, slug } = validatedFields.data;
  try {
    const existingCategory = await prisma.productCategory.findUnique({
      where: { id },
      select: { isDefault: true, name: true },
    });

    if (!existingCategory) return Response.json({ error: "Category not found" }, { status: 404 });
    if (existingCategory.isDefault) {
      return Response.json({ error: "Default product category cannot be updated" }, { status: 403 });
    }

    const result = await prisma.productCategory.update({ where: { id }, data: { name, slug } });
    revalidateProductCategory();

    return Response.json({ message: `Product category "${result.name}" updated successfully` });
  } catch (error) {
    console.log(error);
  }
};
