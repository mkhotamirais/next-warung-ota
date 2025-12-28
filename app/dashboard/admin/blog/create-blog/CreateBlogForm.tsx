"use client";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Image from "next/image";
import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import { BlogCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { createBlog } from "@/actions/blog";
// import { useBlog } from "@/hooks/tanstack-hooks/useBlog";
// import { useBlogCategory } from "@/hooks/tanstack-hooks/useBlogCategory";

export default function CreateBlogForm({ blogCategories }: { blogCategories: BlogCategory[] }) {
  // export default function CreateBlogForm() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, { errors: string[] }>>();
  const [pending, setPending] = useState(false);
  // const { createBlog, isCreating: pending } = useBlog();
  // const { data: blogCategories }: { data: BlogCategory[] | undefined } = useBlogCategory();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const blogCategoriesOptions = blogCategories
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((category) => ({ label: category.name, value: category.id }));
  const defaultCategory = blogCategories?.find((category) => category.isDefault);

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
    setPending(true);

    const formData = new FormData(e.currentTarget);
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

    if (result?.errors) {
      setErrors(result.errors.properties);
      setPending(false);
      return;
    }

    if (result?.error) {
      toast.error(result.error);
      setPending(false);
      return;
    }
    setPending(false);
    toast.success(result?.message);
    router.refresh();
    router.back();
  };

  return (
    <form onSubmit={handleCreate}>
      <Input ref={fileInputRef} id="image" label="image" type="file" onChange={handleFileChange} accept="image/*" />
      {imagePreview && (
        <div className="relative">
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
        id="title"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors?.title?.errors}
      />
      <TiptapEditor label="Content" value={content} onChange={setContent} error={errors?.content?.errors} />

      <Select
        id="category"
        label="category"
        value={categoryId}
        options={blogCategoriesOptions || []}
        onChange={(e) => setCategoryId(e.target.value)}
        error={errors?.categoryId?.errors}
      />

      <Button type="submit" disabled={pending} pending={pending} className="w-fit">
        Submit
      </Button>
    </form>
  );
}
