import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { BlogSchema } from "@/lib/zod";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "8");
  const page = parseInt(searchParams.get("page") || "1");
  const keyword = searchParams.get("keyword");
  const excludeSlug = searchParams.get("excludeSlug");
  const categorySlug = searchParams.get("categorySlug");
  const userId = searchParams.get("userId");

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

  try {
    const totalBlogsCount = await prisma.blog.count({ where: whereClause });
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

    return Response.json({ blogs, totalBlogsCount, totalPages, hasMore, nextPage: page + 1 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const imageFile = formData.get("image") as File | null;
  const rawData = Object.fromEntries(formData.entries());
  const dataForValidation = { ...rawData, image: imageFile instanceof File && imageFile.size > 0 ? imageFile : null };

  const validatedFields = BlogSchema.safeParse(dataForValidation);
  if (!validatedFields.success) {
    return Response.json(
      { error: "Validation failed", errors: z.treeifyError(validatedFields.error) },
      { status: 400 }
    );
  }

  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(`blogs/${Date.now()}-${imageFile.name}`, imageFile, { access: "public", multipart: true });
      imageUrl = blob.url;
    } catch (error) {
      console.log(error);
      return Response.json({ error: "Failed to upload image" }, { status: 500 });
    }
  }

  const { title, slug, content } = validatedFields.data;
  let categoryId = validatedFields.data.categoryId;

  try {
    const existingCategory = await prisma.blogCategory.findUnique({ where: { id: categoryId } });
    if (!existingCategory) {
      const defaultCategory = await prisma.blogCategory.findFirst({ where: { isDefault: true } });
      if (!defaultCategory) return Response.json({ error: "No category found" }, { status: 404 });
      categoryId = defaultCategory.id;
    }

    if (await prisma.blog.findFirst({ where: { title } })) {
      return Response.json({ error: "Blog title already exists" }, { status: 409 });
    }

    await prisma.blog.create({
      data: { title, slug, content, imageUrl, categoryId, userId: session.user.id as string },
    });

    revalidatePath("/");
    revalidatePath("/blog");
    return Response.json({ message: "Blog created successfully" });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
