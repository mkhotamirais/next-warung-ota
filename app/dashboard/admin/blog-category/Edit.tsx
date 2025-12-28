import { updateBlogCategory } from "@/actions/blog-category";
import Input from "@/components/ui/Input";
// import { useBlogCategory } from "@/hooks/tanstack-hooks/useBlogCategory";
import { BlogCategory } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { FaCheck, FaSpinner, FaXmark } from "react-icons/fa6";
import { toast } from "sonner";

interface EditProps {
  category: BlogCategory;
  setIsEdit: Dispatch<SetStateAction<string | null>>;
}

export default function Edit({ category, setIsEdit }: EditProps) {
  const [name, setName] = useState(category.name);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const router = useRouter();
  // const { updateCategory, isUpdating: pending } = useBlogCategory();

  const cancelEdit = () => {
    setIsEdit(null);
    setName(category.name);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    // const res = await fetch(`/api/blog-category/${category.id}`, {
    //   method: "PATCH",
    //   body: JSON.stringify({ name }),
    // });
    // const result = await res.json();
    // const result = await updateCategory({ id: category.id, name });
    const result = await updateBlogCategory(category.id, { name });

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
    setName(name);
    setIsEdit(null);

    router.refresh();
    toast.success(result?.message);
    setPending(false);
  };

  return (
    <form onSubmit={handleUpdate} className="flex gap-2 items-center w-full">
      <input type="hidden" name="id" value={category.id} />
      <Input
        id="name"
        label=""
        placeholder="Blog Category Name"
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
