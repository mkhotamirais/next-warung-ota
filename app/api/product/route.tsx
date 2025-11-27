import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductSchema } from "@/lib/zod"; // Asumsikan ProductSchema sudah disesuaikan
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateProduct = () => {
  revalidatePath("/");
  revalidatePath("/product");
  revalidatePath("/product/page/[page]", "page");
  revalidatePath("/dashboard/admin/product");
};

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN")
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id as string;
  const formData = await req.formData();

  const file = formData.get("image") as File | null;
  const mainImageFile = file instanceof File && file.size > 0 ? file : null;
  const tags = formData.getAll("tags");

  const rawData = Object.fromEntries(formData.entries());
  const dataForValidation = { ...rawData, image: mainImageFile, tags };

  const validatedFields = ProductSchema.safeParse(dataForValidation);
  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) }, { status: 400 });
  }

  const { name, price, stock, slug, description, tags: validatedTags } = validatedFields.data;

  try {
    let categoryId = validatedFields.data.categoryId;

    const existingCategory = await prisma.productCategory.findUnique({ where: { id: categoryId } });
    if (!existingCategory) {
      const defaultCategory = await prisma.productCategory.findFirst({ where: { isDefault: true } });
      if (!defaultCategory)
        return Response.json({ error: "Tidak ada kategori default dan juga kategori terpilih" }, { status: 404 });
      categoryId = defaultCategory.id;
    }

    const existingProduct = await prisma.product.findFirst({ where: { name } });
    if (existingProduct) {
      return Response.json({ error: "Nama produk sudah ada" }, { status: 409 });
    }

    let imageUrl: string | null = null;
    if (mainImageFile) {
      const blob = await put(`product-main-${Date.now()}-${mainImageFile.name}`, mainImageFile, {
        access: "public",
        multipart: true,
      });
      imageUrl = blob.url;
    }

    const newProduct = await prisma.product.create({
      data: { name, price, stock, slug, description, imageUrl, userId, categoryId, tags: validatedTags as string[] },
    });

    revalidateProduct();
    return Response.json({ message: "Product created successfully", productId: newProduct.id });
  } catch (error) {
    console.error("Error creating product:", error);
    return Response.json({ error: "Gagal membuat produk karena kesalahan server." }, { status: 500 });
  }
};
