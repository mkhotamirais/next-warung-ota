"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import { ProductCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { createProduct } from "@/actions/product";
// import { useProduct } from "@/hooks/tanstack-hooks/useProduct";
// import { useProductCategory } from "@/hooks/tanstack-hooks/useProductCategory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-tmp";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProductSchema } from "@/lib/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input-tmp";
import { Button } from "@/components/ui/button-tmp";
import { Spinner } from "@/components/ui/spinner";
import { ControllerRenderProps } from "react-hook-form";
import MultiInput from "@/components/ui/custom/multi-input";

type inferSchema = z.infer<typeof ProductSchema>;
type TagsFieldProps = ControllerRenderProps<inferSchema, "tags">;

export interface CreateProductFormProps {
  productCategories: ProductCategory[];
}

export default function CreateProductForm({ productCategories }: CreateProductFormProps) {
  const form = useForm<inferSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: { name: "", description: "", price: "", stock: "", tags: [], categoryId: "", image: undefined },
  });

  const pending = form.formState.isSubmitting;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [pending, setPending] = useState(false);
  // const { createProduct, isCreating: pending } = useProduct();
  // const { data: productCategories }: { data: ProductCategory[] | undefined } = useProductCategory();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const productCategoriesOptions = productCategories
    ?.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return a.name.localeCompare(b.name);
    })
    .map((category) => ({
      label: category.isDefault ? `${category.name} (Default)` : category.name,
      value: category.id,
    }));
  const defaultCategory = productCategories?.find((category) => category.isDefault);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | null) => void) => {
    const file = e.target.files?.[0] || null;

    onChange(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  // Tambahkan parameter onChange di sini
  const handleRemoveImage = (onChange: (file: null) => void) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    // 3. Reset form state dan preview
    onChange(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: inferSchema) => {
    // setPending(true);
    const { name, price, stock, description, categoryId, image, tags } = data;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description || "");
    formData.append("categoryId", categoryId || defaultCategory?.id || "");

    if (image) {
      formData.append("image", image as Blob);
    }
    tags.map((tag) => {
      formData.append("tags", tag);
    });

    // const res = await fetch("/api/product", { method: "POST", body: formData });
    // const result = await res.json();
    // const result = await createProduct(formData);
    const result = await createProduct(formData);

    if (result?.error) {
      toast.error(result.error);
      // setPending(false);
      return;
    }

    setImagePreview(null);

    // setPending(false);
    toast.success(result?.message);
    form.reset();
    router.refresh();
    router.back();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    name={field.name}
                    onBlur={field.onBlur}
                    disabled={field.disabled}
                    ref={(e) => {
                      field.ref(e);
                      fileInputRef.current = e;
                    }}
                    onChange={(e) => handleFileChange(e, field.onChange)}
                  />

                  {imagePreview && (
                    <div className="relative mt-2">
                      <Image
                        src={imagePreview}
                        alt="preview"
                        width={500}
                        height={300}
                        className="w-full h-56 object-contain rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveImage(field.onChange)}
                        className="absolute right-3 top-3"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input id="price" inputMode="numeric" pattern="[0-9]*" placeholder="Price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input id="stock" inputMode="numeric" pattern="[0-9]*" placeholder="Stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                {/* Hubungkan field ke TiptapEditor */}
                <TiptapEditor value={field.value} onChange={field.onChange} placeholder="Deskripsi" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productCategoriesOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }: { field: TagsFieldProps }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>Gunakan Enter untuk memisahkan setiap tag.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending && <Spinner />}
          Simpan
        </Button>
      </form>
    </Form>
  );
}
