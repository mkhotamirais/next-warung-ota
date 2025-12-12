"use client";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import InputMultiple from "@/components/ui/InputMultiple";
import { ProductCategory } from "@/lib/generated/prisma";
import { SingleProductProps } from "@/types/types";
import { toast } from "sonner";
import { updateProduct } from "@/actions/product";

export interface EditProductFormProps {
  productCategories: ProductCategory[];
  product: SingleProductProps;
}

export default function EditProductForm({ productCategories, product }: EditProductFormProps) {
  const [name, setName] = useState<string>(product.name);
  const [price, setPrice] = useState<string>(String(product.price));
  const [stock, setStock] = useState<string>(String(product.stock));
  const [description, setDescription] = useState<string>(product.description || "");
  const [categoryId, setCategoryId] = useState<string>(product.categoryId);
  const [tags, setTags] = useState<string[]>(product.tags || []);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(product.imageUrl);
  const [removeMainImage, setRemoveMainImage] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, { errors: string[] }>>();

  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const productCategoriesOptions = productCategories
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((category) => ({ label: category.name, value: category.id }));

  const isBlobUrl = (url: string | null) => url?.startsWith("blob:");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imageUrl && isBlobUrl(imageUrl)) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setRemoveMainImage(false);
  };

  const handleRemoveImage = () => {
    if (imageUrl && isBlobUrl(imageUrl)) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageFile(null);
    setImageUrl(null);
    setRemoveMainImage(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("removeMainImage", String(removeMainImage));

    if (imageFile) {
      formData.append("image", imageFile as Blob);
    }
    tags.map((tag) => {
      formData.append("tags", tag);
    });

    startTransition(async () => {
      const result = await updateProduct(product.id, formData);

      if (result?.errors) {
        setErrors(result.errors.properties);
        return;
      }

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // router.push("/dashboard/admin/product");
      router.back();
      router.refresh();
    });
  };

  return (
    <>
      <form onSubmit={handleUpdate}>
        <Input
          ref={fileInputRef}
          id="image"
          label="Image Utama Produk"
          type="file"
          onChange={handleFileChange}
          error={errors?.image?.errors}
        />
        {imageUrl && (
          <div className="relative mb-6">
            <Image
              src={imageUrl}
              alt="preview"
              width={500}
              height={300}
              className="w-full h-56 object-contain object-center bg-gray-100 rounded border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              aria-label="remove image"
              className="absolute right-3 top-3 p-2 rounded border border-red-500 text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        )}

        <Input
          id="name"
          label="Nama Produk"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors?.name?.errors}
        />

        <div className="flex flex-row gap-2">
          <Input
            id="price"
            label="Price"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Price Product"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors?.price?.errors}
            className="w-3/4"
          />

          <Input
            id="stok"
            label="Stok"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Stok produk"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            error={errors?.stock?.errors}
            className="w-1/4"
          />
        </div>

        <TiptapEditor
          label="Description"
          value={description}
          onChange={setDescription}
          error={errors?.description?.errors}
        />

        <Select
          id="productCategory"
          label="Category"
          options={productCategoriesOptions}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          error={errors?.categoryId?.errors}
        />
        <InputMultiple label="Tags" id="tags" value={tags} onChange={setTags} />

        <Button type="submit" disabled={pending} pending={pending}>
          Update Product
        </Button>
      </form>
    </>
  );
}
