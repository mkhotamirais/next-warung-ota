import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductSchema } from "@/lib/zod"; // Asumsikan ProductSchema sudah disesuaikan
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateProduct = () => {
  revalidatePath("/");
  revalidatePath("/product");
  revalidatePath("/product/page/[page]", "page");
  revalidatePath("/dashboard/admin/product");
};

export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const productId = (await params).id;

  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN")
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();

  const file = formData.get("image") as File | null;
  const imageFile = file instanceof File && file.size > 0 ? file : null;
  const tags = formData.getAll("tags");
  const removeImage = formData.get("removeImage") === "true";

  const rawData = Object.fromEntries(formData.entries());
  const dataForValidation = { ...rawData, image: imageFile, tags };

  const validatedFields = ProductSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) }, { status: 400 });
  }

  const { name, price, stock, slug, description, tags: validatedTags, categoryId } = validatedFields.data;

  try {
    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { name: true, imageUrl: true },
    });

    if (!oldProduct) {
      return Response.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }

    const existingProductByName = await prisma.product.findFirst({ where: { name, id: { not: productId } } });
    if (existingProductByName) {
      return Response.json({ error: "Nama produk sudah ada" }, { status: 409 });
    }

    let imageUrlUpdate = oldProduct.imageUrl;
    if (removeImage) {
      if (oldProduct.imageUrl) {
        await del(oldProduct.imageUrl); // Hapus gambar lama jika ada
      }
      imageUrlUpdate = null;
    } else if (imageFile) {
      if (oldProduct.imageUrl) {
        await del(oldProduct.imageUrl);
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
    return Response.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json({ error: "Gagal memperbarui produk karena kesalahan server." }, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const productId = (await params).id;

  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN")
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, imageUrl: true },
    });

    if (!existingProduct) {
      return Response.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }

    if (existingProduct.imageUrl) {
      try {
        await del(existingProduct.imageUrl);
      } catch (blobError) {
        console.error("Failed to delete Vercel blob:", blobError);
      }
    }

    await prisma.product.delete({ where: { id: productId } });

    revalidateProduct();
    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json({ error: "Gagal menghapus produk karena kesalahan server." }, { status: 500 });
  }
};
