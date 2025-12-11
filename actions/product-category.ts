"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductCategorySchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateProductCategory = () => {
  revalidatePath("/dashboard/admin/product-category");
  revalidatePath("/dashboard/admin/product/create-product");
};

export const getProductCategories = async () => {
  const categories = await prisma.productCategory.findMany({ orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
  return categories;
};

export const postProductCategory = async (data: { name: string }) => {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const validatedFields = ProductCategorySchema.safeParse(data);
  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error) };
  }

  const { name, slug } = validatedFields.data;

  if (await prisma.productCategory.findUnique({ where: { slug } })) {
    return { error: `Product category "${name}" already exists` };
  }

  try {
    await prisma.productCategory.create({ data: { name, slug } });
    revalidateProductCategory();
    return { message: `Product category "${name}" created successfully` };
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductCategory = async (id: string) => {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const categoryToDelete = await prisma.productCategory.findUnique({ where: { id } });
  if (!categoryToDelete) {
    return { error: "Product category not found" };
  }

  if (categoryToDelete.isDefault) {
    return { error: "Default product category cannot be deleted" };
  }

  try {
    const postCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (postCount > 0) {
      const defaultCategory = await prisma.productCategory.findFirst({ where: { isDefault: true } });

      if (!defaultCategory) {
        return { error: "Default category not found" };
      }

      await prisma.$transaction(async (tx) => {
        await tx.product.updateMany({ where: { categoryId: id }, data: { categoryId: defaultCategory.id } });
        await tx.productCategory.delete({ where: { id } });
      });

      revalidateProductCategory();

      return {
        message: `Product category "${categoryToDelete.name}" deleted successfully. ${postCount} associated posts have been moved to "${defaultCategory.name}".`,
      };
    } else {
      await prisma.productCategory.delete({ where: { id } });
      revalidateProductCategory();
      return { message: `Product category "${categoryToDelete.name}" deleted successfully` };
    }
  } catch (error) {
    console.log(error);
  }
};

export const patchProductCategory = async (id: string, data: { name: string }) => {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const validatedFields = ProductCategorySchema.safeParse(data);
  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error) };
  }

  const { name, slug } = validatedFields.data;
  try {
    const existingCategory = await prisma.productCategory.findUnique({
      where: { id },
      select: { isDefault: true, name: true },
    });
    if (!existingCategory) {
      return { error: "Category not found" };
    }
    if (existingCategory.isDefault) {
      return { error: "Default product category cannot be updated" };
    }
    const slugExists = await prisma.productCategory.findFirst({ where: { slug, NOT: { id } } });
    if (slugExists) {
      return { error: `Product category "${name}" already exists` };
    }
    const result = await prisma.productCategory.update({ where: { id }, data: { name, slug } });
    revalidateProductCategory();
    return { message: `Product category "${result.name}" updated successfully` };
  } catch (error) {
    console.log(error);
  }
};
