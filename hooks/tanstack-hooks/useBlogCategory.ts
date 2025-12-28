import { BlogCategory } from "@/lib/generated/prisma";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useBlogCategory = () => {
  const queryClient = useQueryClient();

  // 1. Ambil Data
  const query = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const res = await fetch("/api/blog-category");
      const result = (await res.json()) as BlogCategory[];
      return result;
    },
  });

  // 2. Create Mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/blog-category", { method: "POST", body: JSON.stringify({ name }) });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });

  // 3. Update Mutation (Menggunakan ID)
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await fetch(`/api/blog-category/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });

  // 4. Delete Mutation (Menggunakan ID)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blog-category/${id}`, { method: "DELETE" });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });

  return {
    ...query,
    // Create
    createCategory: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    // Update
    updateCategory: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    // Delete
    deleteCategory: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
