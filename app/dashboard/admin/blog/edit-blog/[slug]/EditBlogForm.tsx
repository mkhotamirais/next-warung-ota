"use client";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Image from "next/image";
import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { BlogCategory } from "@/lib/generated/prisma";
import { BlogProps } from "@/types/types";
import Button from "@/components/ui/Button";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import { toast } from "sonner";
import { updateBlog } from "@/actions/blog";
import { useRouter } from "next/navigation";
// import { useBlog } from "@/hooks/tanstack-hooks/useBlog";

interface UpdateBlogFormProps {
  blogCategories: BlogCategory[];
  blog: BlogProps;
}

export default function EditBlogForm({ blogCategories, blog }: UpdateBlogFormProps) {
  const [title, setTitle] = useState(blog?.title);
  const [content, setContent] = useState(blog?.content);
  const [categoryId, setCategoryId] = useState(blog?.categoryId);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, { errors: string[] }>>();
  const [pending, setPending] = useState(false);
  const router = useRouter();
  // const { updateBlog, isUpdating: pending } = useBlog();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const blogCategoriesOptions = blogCategories?.map((category) => ({ label: category.name, value: category.id }));

  const defaultCategory = blogCategories?.find((category) => category.isDefault);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const imagePreviewUrl = URL.createObjectURL(file);
    setImagePreview(imagePreviewUrl);
    setImage(file);
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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);

    const formData = new FormData(e.currentTarget);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    if (image) {
      formData.append("image", image as Blob);
    }

    // const res = await fetch(`/api/blog/${slug}`, { method: "PUT", body: formData });
    // const result = await res.json();
    // const result = await updateBlog({ slug: blog.slug, formData });
    const result = await updateBlog(blog.slug, formData);
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
    <form onSubmit={handleUpdate}>
      {/* image */}
      <Input
        ref={fileInputRef}
        id="image"
        label="Image"
        type="file"
        onChange={handleFileChange}
        error={errors?.image?.errors}
      />
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
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors?.title?.errors}
      />
      <TiptapEditor
        label="Content"
        value={content}
        onChange={(value) => setContent(value)}
        error={errors?.content?.errors}
      />
      {/* <Textarea
          id="content"
          label="Content"
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={errors?.content?.errors}
        /> */}
      <Select
        id="blogCategory"
        label="Category"
        options={blogCategoriesOptions || []}
        value={categoryId || defaultCategory?.id}
        onChange={(e) => setCategoryId(e.target.value)}
        error={errors?.categoryId?.errors}
      />
      <Button type="submit" disabled={pending} pending={pending} className="w-fit">
        Save
      </Button>
    </form>
  );
}
