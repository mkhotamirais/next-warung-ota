"use client";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import InputMultiple from "@/components/ui/InputMultiple";
import { ProductCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { createProduct } from "@/actions/product";

export interface CreateProductFormProps {
  productCategories: ProductCategory[];
}

export default function CreateProductForm({ productCategories }: CreateProductFormProps) {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, { errors: string[] }>>();

  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const productCategoriesOptions = productCategories.map((category) => ({ label: category.name, value: category.id }));
  const defaultCategory = productCategories.find((category) => category.isDefault)!;

  useEffect(() => {
    const settingCategoryId = () => {
      if (defaultCategory && !categoryId) {
        setCategoryId(defaultCategory.id);
      }
    };
    settingCategoryId();
  }, [defaultCategory, categoryId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("categoryId", categoryId);

    if (image) {
      formData.append("image", image as Blob);
    }
    tags.map((tag) => {
      formData.append("tags", tag);
    });

    startTransition(async () => {
      // const res = await fetch("/api/product", { method: "POST", body: formData });
      // const result = await res.json();

      const result = await createProduct(formData);

      if (result?.errors) {
        setErrors(result.errors.properties);
        return;
      }

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);

      setName("");
      setDescription("");
      setTags([]);
      setCategoryId(defaultCategory.id);
      setImage(null);
      setImagePreview(null);

      if (fileInputRef.current) fileInputRef.current.value = "";

      router.replace("/dashboard/admin/product");
      router.refresh();
    });
  };

  return (
    <>
      <form onSubmit={handleCreate}>
        <Input
          ref={fileInputRef}
          id="image"
          label="Image Utama Produk"
          type="file"
          onChange={handleFileChange}
          error={errors?.image?.errors}
        />
        {imagePreview && (
          <div className="relative mb-6">
            <Image
              src={imagePreview}
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
          value={categoryId || defaultCategory.id}
          onChange={(e) => setCategoryId(e.target.value)}
          error={errors?.categoryId?.errors}
        />
        <InputMultiple label="Tags" id="tags" value={tags} onChange={setTags} />

        <Button type="submit" disabled={pending} pending={pending}>
          Create Product
        </Button>
      </form>
    </>
  );
}
