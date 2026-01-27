"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { BlogCategory } from "@/lib/generated/prisma";
import { BlogProps } from "@/types/types";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import { toast } from "sonner";
import { updateBlog } from "@/actions/blog";
import { useRouter } from "next/navigation";
// import { useBlog } from "@/hooks/tanstack-hooks/useBlog";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BlogSchema } from "@/lib/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input-tmp";
import { Button } from "@/components/ui/button-tmp";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type inferSchema = z.infer<typeof BlogSchema>;

interface UpdateBlogFormProps {
  blogCategories: BlogCategory[];
  blog: BlogProps;
}

export default function EditBlogForm({ blogCategories, blog }: UpdateBlogFormProps) {
  const form = useForm<inferSchema>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: blog?.title || "",
      content: blog?.content || "",
      categoryId: blog?.categoryId || "",
      image: undefined,
    },
  });

  const pending = form.formState.isSubmitting;

  const [imagePreview, setImagePreview] = useState<string | null>(blog?.imageUrl || null);
  const [removeImage, setRemoveImage] = useState(false);

  // const [pending, setPending] = useState(false);
  const router = useRouter();
  // const { updateBlog, isUpdating: pending } = useBlog();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const blogCategoriesOptions = blogCategories?.map((category) => ({ label: category.name, value: category.id }));
  const defaultCategory = blogCategories?.find((category) => category.isDefault);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | null) => void) => {
    const file = e.target.files?.[0] || null;

    onChange(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
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
    setRemoveImage(true);

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
    formData.append("removeImage", removeImage.toString());

    // const res = await fetch(`/api/blog/${slug}`, { method: "PUT", body: formData });
    // const result = await res.json();
    // const result = await updateBlog({ slug: blog.slug, formData });
    const result = await updateBlog(blog.slug, formData);

    if (result?.error) {
      toast.error(result.error);
      // setPending(false);
      return;
    }
    // setPending(false);
    toast.success(result?.message);
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
          Simpan
        </Button>
      </form>
    </Form>
  );
}
