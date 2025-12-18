import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { BlogCategorySchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return Response.json(categories);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const validatedFields = BlogCategorySchema.safeParse(body);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) }, { status: 400 });
  }

  const { name, slug } = validatedFields.data;

  if (await prisma.blogCategory.findUnique({ where: { slug } })) {
    return Response.json({ error: `Blog category "${name}" already exists` }, { status: 400 });
  }

  try {
    await prisma.blogCategory.create({ data: { name, slug } });
    revalidatePath("/dashboard/admin/blog-category");
    revalidatePath("/dashboard/admin/blog/create-blog");
    return Response.json({ message: `Blog category "${name}" created successfully` }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
