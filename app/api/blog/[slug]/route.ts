import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { BlogSchema } from "@/lib/zod";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateBlog = () => {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/page/[page]", "page");
};

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const blog = await prisma.blog.findFirst({
      where: { slug },
      include: { BlogCategory: { select: { name: true, slug: true } }, User: { select: { name: true } } },
    });
    if (!blog) return Response.json({ error: "Blog not found" }, { status: 404 });
    return Response.json(blog);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN")
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const slug = (await params).slug;

  const currentBlog = await prisma.blog.findFirst({ where: { slug } });
  if (!currentBlog) return Response.json({ error: "Blog not found" }, { status: 404 });

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

  const { title, content } = validatedFields.data;
  let categoryId = validatedFields.data.categoryId;

  try {
    const existingCategory = await prisma.blogCategory.findUnique({ where: { id: categoryId } });

    if (!existingCategory) {
      const defaultCategory = await prisma.blogCategory.findFirst({ where: { isDefault: true } });
      if (!defaultCategory) {
        return Response.json({ error: "Selected category was deleted and no default category found", status: 404 });
      }
      categoryId = defaultCategory.id;
    }

    const existingBlog = await prisma.blog.findFirst({ where: { slug } });
    if (existingBlog && existingBlog.slug !== slug) {
      return Response.json({ error: "Blog title already exists" }, { status: 409 });
    }

    let newImageUrl = currentBlog.imageUrl || "";
    if (imageFile && imageFile.size > 0) {
      if (currentBlog.imageUrl) await del(currentBlog.imageUrl);
      const blob = await put(`blogs/${Date.now()}-${imageFile.name}`, imageFile, { access: "public", multipart: true });
      newImageUrl = blob.url;
    }

    await prisma.blog.update({ data: { title, slug, content, imageUrl: newImageUrl, categoryId }, where: { slug } });

    revalidateBlog();
    return Response.json({ message: "Blog updated successfully" });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const blog = await prisma.blog.findFirst({ where: { slug } });
    if (!blog) return Response.json({ error: "Blog not found" }, { status: 404 });

    if (blog.imageUrl) await del(blog.imageUrl);
    await prisma.blog.delete({ where: { slug } });

    revalidateBlog();
    return Response.json({ message: `Blog "${blog.title}" deleted successfully` });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
