import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProductCategory = () => {
  const queryClient = useQueryClient();

  // 1. Ambil Data
  const query = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const res = await fetch("/api/product-category");
      const result = await res.json();
      return result;
    },
  });

  // 2. Create Mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/product-category", { method: "POST", body: JSON.stringify({ name }) });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
  });

  // 3. Update Mutation (Menggunakan ID)
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await fetch(`/api/product-category/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
  });

  // 4. Delete Mutation (Menggunakan ID)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/product-category/${id}`, { method: "DELETE" });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
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
