import { auth } from "@/auth";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { ProductSchema } from "@/lib/zod";
import { SortType } from "@/types/types";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import z from "zod";

const revalidateProduct = () => {
  revalidatePath("/");
  revalidatePath("/product");
  revalidatePath("/product/page/[page]", "page");
  revalidatePath("/dashboard/admin/product");
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "8");
  const page = parseInt(searchParams.get("page") || "1");
  const keyword = searchParams.get("keyword") || "";
  const excludeSlug = searchParams.get("excludeSlug") || undefined;
  const categorySlug = searchParams.get("categorySlug") || undefined;
  const userId = searchParams.get("userId") || undefined;
  const sortData = searchParams.get("sortData") as SortType | null;
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;

  const whereClause: Prisma.ProductWhereInput = {};

  if (excludeSlug) whereClause.slug = { not: excludeSlug };
  if (categorySlug) whereClause.ProductCategory = { slug: categorySlug };
  if (userId) whereClause.userId = userId;
  if (keyword) whereClause.name = { contains: keyword, mode: "insensitive" };
  if (minPrice !== undefined && minPrice > 0) {
    whereClause.price = {
      gte: minPrice,
      lte: maxPrice !== undefined ? maxPrice : Number.MAX_SAFE_INTEGER,
    };
  }

  const orderByClause: Prisma.ProductOrderByWithRelationInput[] = [];
  if (sortData) {
    if (sortData === "price_asc") orderByClause.push({ price: "asc" });
    else if (sortData === "price_desc") orderByClause.push({ price: "desc" });
    else if (sortData === "name_asc") orderByClause.push({ name: "asc" });
    else if (sortData === "name_desc") orderByClause.push({ name: "desc" });
  }

  try {
    const totalProductsCount = await prisma.product.count({ where: whereClause });
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause.length > 0 ? orderByClause : { createdAt: "desc" },
      take: limit,
      skip: skip,
      include: {
        ProductCategory: { select: { name: true, slug: true } },
        User: { select: { name: true } },
      },
    });

    const totalPages = Math.ceil(totalProductsCount / limit);
    const hasMore = totalProductsCount > page * limit;

    return Response.json({
      products,
      totalProductsCount,
      totalPages,
      hasMore,
      nextPage: page + 1,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const imageFile = file instanceof File && file.size > 0 ? file : null;
    const tags = formData.getAll("tags");

    const rawData = Object.fromEntries(formData.entries());
    const dataForValidation = { ...rawData, image: imageFile, tags };

    const validatedFields = ProductSchema.safeParse(dataForValidation);
    if (!validatedFields.success) {
      return Response.json({ errors: z.treeifyError(validatedFields.error).properties }, { status: 400 });
    }

    const { name, price, stock, slug, description, tags: validatedTags } = validatedFields.data;
    let categoryId = validatedFields.data.categoryId;

    const existingCategory = await prisma.productCategory.findUnique({ where: { id: categoryId } });
    if (!existingCategory) {
      const defaultCategory = await prisma.productCategory.findFirst({ where: { isDefault: true } });
      if (!defaultCategory) {
        return Response.json({ error: "Category not found" }, { status: 404 });
      }
      categoryId = defaultCategory.id;
    }

    const existingProduct = await prisma.product.findFirst({ where: { name } });
    if (existingProduct) {
      return Response.json({ error: `Nama produk '${name}' sudah ada.` }, { status: 409 });
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
      data: {
        name,
        price,
        stock,
        slug,
        description,
        imageUrl,
        userId,
        categoryId,
        tags: validatedTags as string[],
      },
    });

    revalidateProduct();

    return Response.json({ message: "Product created successfully" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
