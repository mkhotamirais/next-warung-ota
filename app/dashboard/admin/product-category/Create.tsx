"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { createProductCategory } from "@/actions/product-category";
// import { useProductCategory } from "@/hooks/tanstack-hooks/useProductCategory";

export default function Create() {
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  // const { createCategory, isCreating: pending } = useProductCategory();

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);

    // const res = await fetch("/api/product-category", { method: "POST", body: JSON.stringify({ name }) });
    // const result = await res.json();
    // const result = await createCategory(name);
    const result = await createProductCategory({ name });

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

    setPending(false);
    toast.success(result?.message);
    router.refresh();
    inputRef.current?.blur();
  };

  return (
    <>
      <form onSubmit={handleCreate} className="space-y-4 p-3 border border-gray-200 mb-4">
        <Input
          ref={inputRef}
          id="name"
          label="Create Product Category"
          placeholder="Product Category Name"
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
