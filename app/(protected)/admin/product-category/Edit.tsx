"use client";

import { updateProductCategory } from "@/actions/product-category";
import { Button } from "@/components/ui/button-tmp";
import { Input } from "@/components/ui/input";
// import { useProductCategory } from "@/hooks/tanstack-hooks/useProductCategory";
import { ProductCategory } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { FaCheck, FaSpinner, FaXmark } from "react-icons/fa6";
import { toast } from "sonner";

interface EditProps {
  category: ProductCategory;
  setIsEdit: Dispatch<SetStateAction<string | null>>;
}

export default function Edit({ category, setIsEdit }: EditProps) {
  const [name, setName] = useState(category.name);
  const [pending, setPending] = useState(false);
  // const [pending, setPending] = useState(false)
  const router = useRouter();
  // const { updateCategory, isUpdating: pending } = useProductCategory();

  const cancelEdit = () => {
    setIsEdit(null);
    setName(category.name);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);

    // const res = await fetch(`/api/product-category/${category.id}`, {
    //   method: "PUT",
    //   body: JSON.stringify({ name }),
    // });
    // const result = await res.json();
    // const result = await updateCategory({ id: category.id, name });
    const result = await updateProductCategory(category.id, { name });

    if (result?.error) {
      toast.error(result.error);
      setPending(false);
      return;
    }

    setPending(false);
    setName(name);
    setIsEdit(null);

    router.refresh();
    toast.success(result?.message);
  };

  return (
    <form onSubmit={handleUpdate} className="flex gap-2 items-center w-full">
      <input type="hidden" name="id" value={category.id} />
      <Input
        id="name"
        placeholder="Product Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => setIsEdit(null)}
        autoFocus={true}
        className="w-full mb-0!"
      />
      <div className="flex gap-2">
        <Button size="icon" type="submit" disabled={pending} aria-label="Save" onMouseDown={(e) => e.preventDefault()}>
          {pending ? <FaSpinner className="animate-spin" /> : <FaCheck />}
        </Button>
        <Button
          size="icon"
          variant="destructive"
          type="button"
          onClick={cancelEdit}
          onMouseDown={(e) => e.preventDefault()}
          aria-label="Cancel"
        >
          <FaXmark />
        </Button>
      </div>
    </form>
  );
}
