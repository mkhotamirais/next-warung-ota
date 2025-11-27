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

// --- Handler PUT (Update Produk) ---

export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const productId = (await params).id;

  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN")
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();

  // 1. Ekstraksi Data dari FormData
  const file = formData.get("image") as File | null;
  const mainImageFile = file instanceof File && file.size > 0 ? file : null;
  const tags = formData.getAll("tags");
  const removeMainImage = formData.get("removeMainImage") === "true";

  // Data mentah untuk validasi (termasuk price dan stock yang kini ada di root)
  const rawData = Object.fromEntries(formData.entries());
  const dataForValidation = {
    ...rawData,
    image: mainImageFile,
    tags,
    // Hapus data varian
  };

  const validatedFields = ProductSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) }, { status: 400 });
  }

  // Ambil field yang sudah divalidasi, termasuk price dan stock
  const { name, price, stock, slug, description, tags: validatedTags, categoryId } = validatedFields.data;

  try {
    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        name: true,
        imageUrl: true,
        // Hapus ProductVariant
      },
    });

    if (!oldProduct) {
      return Response.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }

    // Cek duplikasi nama produk
    const existingProductByName = await prisma.product.findFirst({ where: { name, id: { not: productId } } });
    if (existingProductByName) {
      return Response.json({ error: "Nama produk sudah ada" }, { status: 409 });
    }

    // 2. Penanganan Gambar Utama (Vercel Blob)
    let imageUrlUpdate = oldProduct.imageUrl;
    if (removeMainImage) {
      if (oldProduct.imageUrl) {
        await del(oldProduct.imageUrl); // Hapus gambar lama jika ada
      }
      imageUrlUpdate = null;
    } else if (mainImageFile) {
      // Jika ada file baru, hapus yang lama dan upload yang baru
      if (oldProduct.imageUrl) {
        await del(oldProduct.imageUrl);
      }
      const blob = await put(`product-main-${Date.now()}-${mainImageFile.name}`, mainImageFile, {
        access: "public",
        multipart: true,
      });
      imageUrlUpdate = blob.url;
    }

    // 3. Update Produk Utama (Tanpa Transaksi karena operasi DB tunggal)
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price, // Langsung di update
        stock, // Langsung di update
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

// --- Handler DELETE (Hapus Produk) ---

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

    // Hapus gambar utama (tidak ada gambar varian lagi)
    if (existingProduct.imageUrl) {
      try {
        await del(existingProduct.imageUrl);
      } catch (blobError) {
        console.error("Failed to delete Vercel blob:", blobError);
      }
    }

    // Hapus Produk
    // Tidak perlu transaksi karena tidak ada relasi varian yang kompleks
    await prisma.product.delete({ where: { id: productId } });

    revalidateProduct();
    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json({ error: "Gagal menghapus produk karena kesalahan server." }, { status: 500 });
  }
};
