"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductSchema } from "@/lib/zod";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateProduct = () => {
  revalidatePath("/");
  revalidatePath("/product");
  revalidatePath("/product/page/[page]", "page");
  revalidatePath("/dashboard/admin/product");
};

export const getProductCategoryBySlug = async (slug: string) => {
  const category = await prisma.productCategory.findUnique({ where: { slug } });
  return category;
};

export async function getProductNames(keywords?: string) {
  if (!keywords) return [];

  const whereClause: {
    name?: { contains: string; mode: "insensitive" };
  } = {};

  whereClause.name = { contains: keywords, mode: "insensitive" };

  try {
    const products = await prisma.product.findMany({
      where: whereClause,
      select: { name: true },
      distinct: ["name"],
      orderBy: { name: "asc" },
      take: 10,
    });

    return products;
  } catch (error) {
    console.error("Error fetching product names:", error);
    return [];
  }
}

export async function getTotalProductsCount() {
  const count = await prisma.product.count();
  return count;
}

interface GetProductParams {
  limit?: number;
  page?: number;
  excludeSlug?: string;
  categorySlug?: string;
  userId?: string;
  keyword?: string;
  sortPrice?: "asc" | "desc" | null;
  minPrice?: number;
  maxPrice?: number;
}

export const getProducts = async ({
  limit = 8,
  page = 1,
  excludeSlug,
  categorySlug,
  userId,
  keyword = "",
}: GetProductParams = {}) => {
  const whereClause: {
    slug?: { not: string };
    ProductCategory?: { slug: string };
    userId?: string;
    name?: { contains: string; mode: "insensitive" };
  } = {};

  if (excludeSlug) whereClause.slug = { not: excludeSlug };
  if (categorySlug) whereClause.ProductCategory = { slug: categorySlug };
  if (userId) whereClause.userId = userId;
  if (keyword) whereClause.name = { contains: keyword, mode: "insensitive" };

  const totalProductsCount = await prisma.product.count({ where: whereClause });

  const skip = (page - 1) * limit;

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: skip,
    include: {
      ProductCategory: { select: { name: true, slug: true } },
      User: { select: { name: true } },
    },
  });

  const totalPages = Math.ceil(totalProductsCount / limit);
  const hasMore = totalProductsCount > page * limit;
  return { products, totalProductsCount, totalPages, hasMore, nextPage: page + 1 };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      ProductCategory: { select: { name: true, slug: true } },
      User: { select: { name: true } },
    },
  });
  return product;
};

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id as string;

  const file = formData.get("image") as File | null;
  const imageFile = file instanceof File && file.size > 0 ? file : null;
  const tags = formData.getAll("tags");

  const rawData = Object.fromEntries(formData.entries());
  const dataForValidation = { ...rawData, image: imageFile, tags };

  const validatedFields = ProductSchema.safeParse(dataForValidation);
  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error) };
  }

  const { name, price, stock, slug, description, tags: validatedTags } = validatedFields.data;

  try {
    let categoryId = validatedFields.data.categoryId;

    const existingCategory = await prisma.productCategory.findUnique({ where: { id: categoryId } });
    if (!existingCategory) {
      const defaultCategory = await prisma.productCategory.findFirst({ where: { isDefault: true } });
      if (!defaultCategory) return { error: "Tidak ada kategori default dan juga kategori terpilih yang valid." };
      categoryId = defaultCategory.id;
    }

    const existingProduct = await prisma.product.findFirst({ where: { name } });
    if (existingProduct) {
      return { error: `Nama produk '${name}' sudah ada.` };
    }

    let imageUrl: string | null = null;
    if (imageFile) {
      const blob = await put(`products/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
        multipart: true,
      });
      imageUrl = blob.url;
    }

    await prisma.product.create({
      data: { name, price, stock, slug, description, imageUrl, userId, categoryId, tags: validatedTags as string[] },
    });

    revalidateProduct();

    return { message: "Product created successfully" };
  } catch (error) {
    console.log("Error creating product:", error);
    return {
      error: "Gagal membuat produk karena kesalahan server yang tidak terduga.",
    };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const file = formData.get("image") as File | null;
  const imageFile = file instanceof File && file.size > 0 ? file : null;
  const tags = formData.getAll("tags");
  const removeImage = formData.get("removeImage") === "true";

  const rawData = Object.fromEntries(formData.entries());
  const dataForValidation = { ...rawData, image: imageFile, tags };

  const validatedFields = ProductSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error) };
  }

  const { name, price, stock, slug, description, tags: validatedTags, categoryId } = validatedFields.data;

  try {
    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { name: true, imageUrl: true },
    });

    if (!oldProduct) {
      return { error: "Produk tidak ditemukan." };
    }

    const existingProductByName = await prisma.product.findFirst({ where: { name, id: { not: productId } } });
    if (existingProductByName) {
      return { error: "Nama produk sudah ada." };
    }

    let imageUrlUpdate = oldProduct.imageUrl;

    if (removeImage) {
      if (oldProduct.imageUrl) {
        await del(oldProduct.imageUrl); // Hapus gambar lama
      }
      imageUrlUpdate = null;
    } else if (imageFile) {
      if (oldProduct.imageUrl) {
        await del(oldProduct.imageUrl); // Hapus gambar lama sebelum upload yang baru
      }
      const blob = await put(`products/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
        multipart: true,
      });
      imageUrlUpdate = blob.url;
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        stock,
        slug,
        description,
        imageUrl: imageUrlUpdate,
        categoryId: categoryId,
        tags: validatedTags as string[],
      },
    });

    revalidateProduct();

    return { message: "Product updated successfully" };
  } catch (error) {
    console.error("Error updating product:", error);
    return { error: "Gagal memperbarui produk karena kesalahan server yang tidak terduga." };
  }
}

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, imageUrl: true },
    });

    if (!existingProduct) {
      return { success: false, message: "Produk tidak ditemukan." };
    }

    if (existingProduct.imageUrl) {
      try {
        await del(existingProduct.imageUrl);
      } catch (blobError) {
        console.log("Failed to delete Vercel blob:", blobError);
      }
    }

    await prisma.product.delete({ where: { id: productId } });

    revalidateProduct();

    return { message: "Product deleted successfully" };
  } catch (error) {
    console.log("Error deleting product:", error);
    return { error: "Gagal menghapus produk karena kesalahan server yang tidak terduga." };
  }
}
