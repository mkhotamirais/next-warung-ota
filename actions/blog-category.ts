"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { BlogCategorySchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateBlogCategory = () => {
  revalidatePath("/dashboard/admin/blog-category");
  revalidatePath("/dashboard/admin/blog/create-blog");
};

// GET /api/blog-categry
export const getBlogCategories = async () => {
  const categories = await prisma.blogCategory.findMany({ orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
  return categories;
};

// POST /api/blog-category
export const createBlogCategory = async (data: { name: string }) => {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const validatedFields = BlogCategorySchema.safeParse(data);
  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error) };
  }

  const { name, slug } = validatedFields.data;

  if (await prisma.blogCategory.findUnique({ where: { slug } })) {
    return { error: `Blog category "${name}" already exists` };
  }

  try {
    await prisma.blogCategory.create({ data: { name, slug } });
    revalidateBlogCategory();
    return { message: `Blog category "${name}" created successfully` };
  } catch (error) {
    console.log(error);
    return { error: "Failed to create blog category, please check your connection and try again" };
  }
};

// DELETE /api/blog-category/:id
export const deleteBlogCategory = async (id: string) => {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const categoryToDelete = await prisma.blogCategory.findUnique({ where: { id } });
  if (!categoryToDelete) {
    return { error: "Blog category not found" };
  }

  if (categoryToDelete.isDefault) {
    return { error: "Default blog category cannot be deleted" };
  }

  try {
    const postCount = await prisma.blog.count({
      where: { categoryId: id },
    });

    if (postCount > 0) {
      const defaultCategory = await prisma.blogCategory.findFirst({ where: { isDefault: true } });

      if (!defaultCategory) {
        return { error: "Default category not found" };
      }

      await prisma.$transaction(async (tx) => {
        await tx.blog.updateMany({ where: { categoryId: id }, data: { categoryId: defaultCategory.id } });
        await tx.blogCategory.delete({ where: { id } });
      });

      revalidateBlogCategory();

      return {
        message: `Blog category "${categoryToDelete.name}" deleted successfully. ${postCount} associated posts have been moved to "${defaultCategory.name}".`,
      };
    } else {
      await prisma.blogCategory.delete({ where: { id } });
      revalidateBlogCategory();
      return { message: `Blog category "${categoryToDelete.name}" deleted successfully` };
    }
  } catch (error) {
    console.log(error);
    return { error: "Failed to delete blog category, please check your connection and try again" };
  }
};

// PUT /api/blog-category/:id
export const updateBlogCategory = async (id: string, data: { name: string }) => {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const validatedFields = BlogCategorySchema.safeParse(data);
  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error) };
  }

  const { name, slug } = validatedFields.data;
  try {
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id },
      select: { isDefault: true, name: true },
    });
    if (!existingCategory) {
      return { error: "Category not found" };
    }
    if (existingCategory.isDefault) {
      return { error: "Default blog category cannot be updated" };
    }
    const slugExists = await prisma.blogCategory.findFirst({ where: { slug, NOT: { id } } });
    if (slugExists) {
      return { error: `Blog category "${name}" already exists` };
    }
    const result = await prisma.blogCategory.update({ where: { id }, data: { name, slug } });
    revalidateBlogCategory();
    return { message: `Blog category "${result.name}" updated successfully` };
  } catch (error) {
    console.log(error);
    return { error: "Failed to update blog category, please check your connection and try again" };
  }
};
