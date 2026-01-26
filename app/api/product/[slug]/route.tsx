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

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        ProductCategory: { select: { name: true, slug: true } },
        User: { select: { name: true } },
      },
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oldProduct = await prisma.product.findUnique({ where: { slug } });

    if (!oldProduct) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const imageFile = file instanceof File && file.size > 0 ? file : null;
    const tags = formData.getAll("tags");
    const removeImage = formData.get("removeImage") === "true";

    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = ProductSchema.safeParse({ ...rawData, image: imageFile, tags });

    if (!validatedFields.success) {
      return Response.json({ errors: z.treeifyError(validatedFields.error) }, { status: 400 });
    }

    const { name, price, stock, description, tags: validatedTags, categoryId } = validatedFields.data;

    const duplicateName = await prisma.product.findFirst({ where: { name, id: { not: oldProduct.id } } });
    if (duplicateName) return Response.json({ error: "Nama produk sudah digunakan." }, { status: 409 });

    let imageUrlUpdate: string | null = oldProduct.imageUrl;

    if (removeImage) {
      if (oldProduct.imageUrl) await del(oldProduct.imageUrl);
      imageUrlUpdate = null;
    } else if (imageFile) {
      if (oldProduct.imageUrl) await del(oldProduct.imageUrl);
      const blob = await put(`products/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
        multipart: true,
      });
      imageUrlUpdate = blob.url;
    }

    await prisma.product.update({
      where: { id: oldProduct.id },
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        slug,
        description,
        imageUrl: imageUrlUpdate,
        categoryId,
        tags: validatedTags as string[],
      },
    });

    revalidateProduct();
    return Response.json({ message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, imageUrl: true, name: true },
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.imageUrl) {
      try {
        await del(product.imageUrl);
      } catch (blobError) {
        console.log("Blob deletion failed:", blobError);
      }
    }

    await prisma.product.delete({
      where: { id: product.id },
    });

    revalidateProduct();
    return Response.json({ message: `Product "${product.name}" deleted successfully` });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
