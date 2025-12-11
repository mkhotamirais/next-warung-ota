import { patchProductCategory } from "@/actions/product-category";
import Input from "@/components/ui/Input";
import { ProductCategory } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { FaCheck, FaSpinner, FaXmark } from "react-icons/fa6";
import { toast } from "sonner";

interface EditProps {
  category: ProductCategory;
  setIsEdit: Dispatch<SetStateAction<string | null>>;
}

export default function Edit({ category, setIsEdit }: EditProps) {
  const [name, setName] = useState(category.name);
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const cancelEdit = () => {
    setIsEdit(null);
    setName(category.name);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await patchProductCategory(category.id, { name });

      if (result?.errors) {
        setErrors(result.errors.properties);
        return;
      }

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setName(name);
      setIsEdit(null);

      router.refresh();
      toast.success(result?.message);
    });
  };

  return (
    <form onSubmit={handleUpdate} className="flex gap-2 items-center w-full">
      <input type="hidden" name="id" value={category.id} />
      <Input
        id="name"
        label=""
        placeholder="Product Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => setIsEdit(null)}
        autoFocus={true}
        error={errors?.name?.errors}
        className="w-full mb-0!"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          aria-label="Save"
          onMouseDown={(e) => e.preventDefault()}
          className="border rounded p-2 text-green-500"
        >
          {pending ? <FaSpinner className="animate-spin" /> : <FaCheck />}
        </button>
        <button
          type="button"
          onClick={cancelEdit}
          onMouseDown={(e) => e.preventDefault()}
          className="border rounded p-2 text-red-500"
          aria-label="Cancel"
        >
          <FaXmark />
        </button>
      </div>
    </form>
  );
}
