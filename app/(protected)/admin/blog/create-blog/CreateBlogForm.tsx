"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import { BlogCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { createBlog } from "@/actions/blog";
// import { useBlog } from "@/hooks/tanstack-hooks/useBlog";
// import { useBlogCategory } from "@/hooks/tanstack-hooks/useBlogCategory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BlogSchema } from "@/lib/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input-tmp";
import { Button } from "@/components/ui/button-tmp";
import { Spinner } from "@/components/ui/spinner";

type inferSchema = z.infer<typeof BlogSchema>;

export default function CreateBlogForm({ blogCategories }: { blogCategories: BlogCategory[] }) {
  const form = useForm<inferSchema>({
    resolver: zodResolver(BlogSchema),
    defaultValues: { title: "", content: "", categoryId: "", image: undefined },
  });

  const pending = form.formState.isSubmitting;

  // export default function CreateBlogForm() {
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [pending, setPending] = useState(false);
  // const { createBlog, isCreating: pending } = useBlog();
  // const { data: blogCategories }: { data: BlogCategory[] | undefined } = useBlogCategory();

  // const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const blogCategoriesOptions = blogCategories
    ?.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return a.name.localeCompare(b.name);
    })
    .map((category) => ({
      label: category.isDefault ? `${category.name} (Default)` : category.name,
      value: category.id,
    }));
  const defaultCategory = blogCategories?.find((category) => category.isDefault);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tambahkan parameter onChange di sini
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
    const { title, content, categoryId, image } = data;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", categoryId || defaultCategory?.id || "");
    if (image) {
      formData.append("image", image as Blob);
    }

    // const res = await fetch("/api/blog", { method: "POST", body: formData });
    // const result = await res.json();
    // const result = await createBlog(formData);
    const result = await createBlog(formData);

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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Isi Konten</FormLabel>
              <FormControl>
                {/* Hubungkan field ke TiptapEditor */}
                <TiptapEditor value={field.value} onChange={field.onChange} />
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
                  {blogCategoriesOptions.map((item) => (
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
        <Button type="submit" disabled={pending}>
          {pending && <Spinner />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
