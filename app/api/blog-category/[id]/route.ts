import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { BlogCategorySchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const validatedFields = BlogCategorySchema.safeParse(body);
  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) }, { status: 400 });
  }

  const { name, slug } = validatedFields.data;

  try {
    const existingCategory = await prisma.blogCategory.findUnique({ where: { id } });
    if (!existingCategory) return Response.json({ error: "Category not found" }, { status: 404 });
    if (existingCategory.isDefault)
      return Response.json({ error: "Default category cannot be updated" }, { status: 400 });

    const slugExists = await prisma.blogCategory.findFirst({ where: { slug, NOT: { id } } });
    if (slugExists) return Response.json({ error: `Blog category "${name}" already exists` }, { status: 400 });

    const result = await prisma.blogCategory.update({ where: { id }, data: { name, slug } });
    revalidatePath("/dashboard/admin/blog-category");
    revalidatePath("/dashboard/admin/blog/create-blog");
    return Response.json({ message: `Blog category "${result.name}" updated successfully` });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const categoryToDelete = await prisma.blogCategory.findUnique({ where: { id } });
    if (!categoryToDelete) return Response.json({ error: "Blog category not found" }, { status: 404 });
    if (categoryToDelete.isDefault)
      return Response.json({ error: "Default category cannot be deleted" }, { status: 400 });

    const postCount = await prisma.blog.count({ where: { categoryId: id } });

    if (postCount > 0) {
      const defaultCategory = await prisma.blogCategory.findFirst({ where: { isDefault: true } });
      if (!defaultCategory) return Response.json({ error: "Default category not found" }, { status: 404 });

      await prisma.$transaction(async (tx) => {
        await tx.blog.updateMany({ where: { categoryId: id }, data: { categoryId: defaultCategory.id } });
        await tx.blogCategory.delete({ where: { id } });
      });

      revalidatePath("/dashboard/admin/blog-category");
      revalidatePath("/dashboard/admin/blog/create-blog");
      return Response.json({
        message: `Blog category "${categoryToDelete.name}" deleted. ${postCount} posts moved to "${defaultCategory.name}".`,
      });
    } else {
      await prisma.blogCategory.delete({ where: { id } });
      revalidatePath("/dashboard/admin/blog-category");
      revalidatePath("/dashboard/admin/blog/create-blog");
      return Response.json({ message: `Blog category "${categoryToDelete.name}" deleted successfully` });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
