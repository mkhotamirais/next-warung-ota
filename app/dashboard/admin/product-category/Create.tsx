"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { postProductCategory } from "@/actions/product-category";

export default function Create() {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await postProductCategory({ name });

      if (result?.errors) {
        setErrors(result.errors.properties);
        return;
      }

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setName("");

      router.refresh();
      toast.success(result?.message);
    });
  };

  return (
    <>
      <form onSubmit={handleCreate} className="space-y-4 p-3 border border-gray-200 mb-4">
        <Input
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
