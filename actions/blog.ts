"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { BlogSchema } from "@/lib/zod";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateBlog = () => {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/page/[page]", "page");
};

// GET /api/blog
interface GetBlogParams {
  limit?: number;
  page?: number;
  keyword?: string;
  excludeSlug?: string;
  categorySlug?: string;
  userId?: string;
}

export const getBlogs = async ({
  limit = 8,
  page = 1,
  keyword,
  excludeSlug,
  categorySlug,
  userId,
}: GetBlogParams = {}) => {
  const whereClause: {
    title?: { contains: string; mode: "insensitive" };
    slug?: { not: string };
    BlogCategory?: { slug: string };
    userId?: string;
  } = {};

  if (keyword) whereClause.title = { contains: keyword, mode: "insensitive" };
  if (excludeSlug) whereClause.slug = { not: excludeSlug };
  if (categorySlug) whereClause.BlogCategory = { slug: categorySlug };
  if (userId) whereClause.userId = userId;

  const totalBlogsCount = await prisma.blog.count({
    where: whereClause,
  });

  const skip = (page - 1) * limit;

  const blogs = await prisma.blog.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: skip,
    include: {
      BlogCategory: { select: { name: true, slug: true } },
      User: { select: { name: true } },
    },
  });

  const totalPages = Math.ceil(totalBlogsCount / limit);
  const hasMore = totalBlogsCount > page * limit;

  return { blogs, totalBlogsCount, totalPages, hasMore, nextPage: page + 1 };
};

// GET /api/blog/:slug
export const getBlogBySlug = async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { BlogCategory: { select: { name: true, slug: true } }, User: { select: { name: true } } },
  });
  return blog;
};

// POST /api/blog
export async function createBlog(formData: FormData) {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" as const, status: 401 };
  }
  const userId = session.user.id as string;

  const image = formData.get("image") as File | null;
  const imageFile = image instanceof File && image.size > 0 ? image : null;
  const rawData = Object.fromEntries(formData.entries());

  const dataForValidation = { ...rawData, image: imageFile };
  const slug = generateSlug(rawData.title as string);

  const validatedFields = BlogSchema.safeParse(dataForValidation);
  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error) };
  }

  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(`blogs/${Date.now()}-${imageFile.name}`, imageFile, { access: "public", multipart: true });
      imageUrl = blob.url;
    } catch (error) {
      console.error("Error uploading blob:", error);
      return { error: "Failed to upload image" as const, status: 500 };
    }
  }

  const { title, content } = validatedFields.data;
  let categoryId = validatedFields.data.categoryId;

  try {
    const existingCategory = await prisma.blogCategory.findUnique({ where: { id: categoryId } });

    if (!existingCategory) {
      const defaultCategory = await prisma.blogCategory.findFirst({ where: { isDefault: true } });
      if (!defaultCategory) {
        return { error: "Selected category was deleted and no default category found" as const, status: 404 };
      }
      categoryId = defaultCategory.id;
    }

    const existingBlog = await prisma.blog.findFirst({ where: { title } });

    if (existingBlog) {
      return { error: "Blog title already exists" as const, status: 409 };
    }

    await prisma.blog.create({ data: { title, slug, content, imageUrl, categoryId, userId } });

    revalidateBlog();
    return { message: "Blog created successfully" as const, status: 200 };
  } catch (error) {
    console.error("Database error during blog creation:", error);
    return { error: "An unexpected error occurred" as const, status: 500 };
  }
}

// PUT /api/blog/:id
export async function updateBlog(slug: string, formData: FormData) {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return { error: "Unauthorized", status: 401 };
  }

  const currentBlog = await prisma.blog.findFirst({ where: { slug }, select: { userId: true, imageUrl: true } });
  if (!currentBlog) {
    return { error: "Blog not found", status: 404 };
  }

  const image = formData.get("image") as File | null;
  const imageFile = image instanceof File && image.size > 0 ? image : null;

  const rawData = Object.fromEntries(formData.entries());
  const dataForValidation = { ...rawData, image: imageFile };

  const validatedFields = BlogSchema.safeParse(dataForValidation);
  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error) };
  }

  const { title, content } = validatedFields.data;
  let categoryId = validatedFields.data.categoryId;

  try {
    const existingCategory = await prisma.blogCategory.findUnique({ where: { id: categoryId } });

    if (!existingCategory) {
      const defaultCategory = await prisma.blogCategory.findFirst({ where: { isDefault: true } });
      if (!defaultCategory) {
        return { error: "Selected category was deleted and no default category found", status: 404 };
      }
      categoryId = defaultCategory.id;
    }

    const existingBlog = await prisma.blog.findFirst({ where: { title } });

    if (existingBlog && existingBlog.slug !== slug) {
      return { error: "Blog title already exists", status: 409 };
    }

    let newImageUrl = currentBlog.imageUrl || "";
    if (imageFile && imageFile.size > 0) {
      if (currentBlog.imageUrl) {
        await del(currentBlog.imageUrl);
      }
      const blob = await put(`blogs/${Date.now()}-${imageFile.name}`, imageFile, { access: "public", multipart: true });
      newImageUrl = blob.url;
    }
    if (rawData.removeImage === "true") {
      if (currentBlog.imageUrl) {
        await del(currentBlog.imageUrl);
      }
      newImageUrl = "";
    }

    await prisma.blog.update({ data: { title, slug, content, imageUrl: newImageUrl, categoryId }, where: { slug } });

    revalidateBlog();
    return { message: "Blog updated successfully" };
  } catch (error) {
    console.log("Database error during blog update:", error);
    return { error: "An unexpected error occurred" };
  }
}

// DELETE /api/blog/:id
export async function deleteBlog(slug: string) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
      select: { id: true, title: true, slug: true, imageUrl: true },
    });

    if (!existingBlog) return { success: false, message: "Blog tidak ditemukan." };

    if (existingBlog.imageUrl) {
      try {
        await del(existingBlog.imageUrl);
      } catch (blobError) {
        console.log("Failed to delete Vercel blob:", blobError);
      }
    }
    await prisma.blog.delete({ where: { slug } });

    revalidateBlog();
    return { message: `Blog "${existingBlog?.title}" deleted successfully` };
  } catch (error) {
    console.log("Database error during blog deletion:", error);
    return { error: "Failed to delete blog" };
  }
}
