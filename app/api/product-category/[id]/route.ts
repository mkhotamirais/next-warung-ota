import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductCategorySchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateProductCategory = () => {
  revalidatePath("/dashboard/admin/product-category");
  revalidatePath("/dashboard/admin/product/create-product");
};

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const existingCategory = await prisma.productCategory.findUnique({
      where: { id },
      select: { isDefault: true },
    });

    if (!existingCategory) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    if (existingCategory.isDefault) {
      return Response.json({ error: "Default product category cannot be updated" }, { status: 400 });
    }

    const slugExists = await prisma.productCategory.findFirst({
      where: { slug, NOT: { id } },
    });

    if (slugExists) {
      return Response.json({ error: `Product category "${name}" already exists` }, { status: 400 });
    }

    const result = await prisma.productCategory.update({
      where: { id },
      data: { name, slug },
    });

    revalidateProductCategory();

    return Response.json({
      message: `Product category "${result.name}" updated successfully`,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categoryToDelete = await prisma.productCategory.findUnique({
      where: { id },
    });

    if (!categoryToDelete) {
      return Response.json({ error: "Product category not found" }, { status: 404 });
    }

    if (categoryToDelete.isDefault) {
      return Response.json({ error: "Default product category cannot be deleted" }, { status: 400 });
    }

    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      const defaultCategory = await prisma.productCategory.findFirst({
        where: { isDefault: true },
      });

      if (!defaultCategory) {
        return Response.json({ error: "Default category not found" }, { status: 404 });
      }

      await prisma.$transaction(async (tx) => {
        await tx.product.updateMany({
          where: { categoryId: id },
          data: { categoryId: defaultCategory.id },
        });
        await tx.productCategory.delete({ where: { id } });
      });

      revalidateProductCategory();

      return Response.json({
        message: `Product category "${categoryToDelete.name}" deleted successfully. ${productCount} associated products have been moved to "${defaultCategory.name}".`,
      });
    } else {
      await prisma.productCategory.delete({ where: { id } });
      revalidateProductCategory();
      return Response.json({
        message: `Product category "${categoryToDelete.name}" deleted successfully`,
      });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
