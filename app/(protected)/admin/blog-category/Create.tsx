"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { useBlogCategory } from "@/hooks/tanstack-hooks/useBlogCategory";
import { createBlogCategory } from "@/actions/blog-category";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button-tmp";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BlogCategorySchema } from "@/lib/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type inferSchema = z.infer<typeof BlogCategorySchema>;

export default function Create() {
  const form = useForm<inferSchema>({
    resolver: zodResolver(BlogCategorySchema),
    defaultValues: { name: "" },
  });

  const pending = form.formState.isSubmitting;

  // const [pending, setPending] = useState(false);
  // const { createCategory, isCreating: pending } = useBlogCategory();

  const router = useRouter();

  const onSubmit = async (data: inferSchema) => {
    // const res = await fetch("/api/blog-category", { method: "POST", body: JSON.stringify({ name }) });
    // const result = await res.json();
    // const result = await createCategory(name);
    const result = await createBlogCategory(data);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    form.reset();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    toast.success(result?.message);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <Button type="submit" disabled={pending} className="w-fit">
        {pending && <Spinner />}
        Create
      </Button>
    </Form>
  );
}
