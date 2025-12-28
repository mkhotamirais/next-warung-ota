"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
// import { useBlogCategory } from "@/hooks/tanstack-hooks/useBlogCategory";
import { createBlogCategory } from "@/actions/blog-category";

export default function Create() {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const [pending, setPending] = useState(false);
  // const { createCategory, isCreating: pending } = useBlogCategory();

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);

    // const res = await fetch("/api/blog-category", { method: "POST", body: JSON.stringify({ name }) });
    // const result = await res.json();
    // const result = await createCategory(name);
    const result = await createBlogCategory({ name });

    if (result?.errors) {
      setErrors(result.errors.properties);
      setPending(false);
      setTimeout(() => setErrors(undefined), 3000);
      return;
    }

    if (result?.error) {
      toast.error(result.error);
      setPending(false);
      return;
    }
    setName("");

    inputRef.current?.blur();
    setPending(false);
    toast.success(result?.message);
    router.refresh();
  };

  return (
    <>
      <form onSubmit={handleCreate} className="space-y-4 p-3 border border-gray-200 mb-4">
        <Input
          ref={inputRef}
          id="name"
          label="Create Blog Category"
          placeholder="Blog Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors?.name?.errors}
        />
        <Button type="submit" disabled={pending} pending={pending} className="w-fit">
          Create
        </Button>
      </form>
    </>
  );
}
