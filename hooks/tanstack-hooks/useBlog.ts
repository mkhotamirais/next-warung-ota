import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 1. Hook Utama untuk List & CRUD
export const useBlog = (page: number = 1, limit: number = 8, keyword: string = "") => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["blogs", page, limit, keyword],
    queryFn: async () => {
      const res = await fetch(`/api/blog?page=${page}&limit=${limit}&keyword=${keyword || ""}`);
      const result = await res.json();
      return result;
    },
    placeholderData: (previousData) => previousData, // UX halus saat ganti halaman
  });

  // CREATE BLOG (Menggunakan FormData)
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  // UPDATE BLOG (Menggunakan Slug/ID & FormData)
  const updateMutation = useMutation({
    mutationFn: async ({ slug, formData }: { slug: string; formData: FormData }) => {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
        body: formData,
      });
      const result = await res.json();
      if (result.error || result.errors) throw result;
      return result;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      // Juga refresh cache detail blog yang spesifik ini
      queryClient.invalidateQueries({ queryKey: ["blog", variables.slug] });
    },
  });

  // DELETE BLOG (Menggunakan Slug)
  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
      const result = await res.json();
      if (result.error) throw result;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  return {
    ...query,
    createBlog: createMutation.mutateAsync, // Pakai Async agar bisa di-await di form
    isCreating: createMutation.isPending,
    updateBlog: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteBlog: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

// 2. Hook Tambahan untuk Detail Blog (Get by Slug)
export const useBlogDetail = (slug: string) => {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/blog/${slug}`);
      if (!res.ok) throw new Error("Blog not found");
      return res.json();
    },
    enabled: !!slug, // Hanya jalan jika slug ada
  });
};
