import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 1. Hook Utama untuk List & CRUD (Create, Update, Delete)
export const useProduct = (page: number = 1, limit: number = 8, keyword: string = "") => {
  const queryClient = useQueryClient();

  // GET ALL PRODUCTS (Daftar Produk)
  const query = useQuery({
    queryKey: ["products", page, limit, keyword],
    queryFn: async () => {
      const res = await fetch(`/api/product?page=${page}&limit=${limit}&keyword=${keyword || ""}`);
      if (!res.ok) throw new Error("Gagal mengambil daftar produk");
      const result = await res.json();
      return result;
    },
    placeholderData: (previousData) => previousData,
  });

  // CREATE PRODUCT
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/product", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      // Refresh daftar produk
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // UPDATE PRODUCT (Menggunakan Slug)
  const updateMutation = useMutation({
    mutationFn: async ({ slug, formData }: { slug: string; formData: FormData }) => {
      const res = await fetch(`/api/product/${slug}`, {
        method: "PUT",
        body: formData,
      });
      const result = await res.json();
      return result;
    },
    onSuccess: (data, variables) => {
      // 1. Invalidate list produk
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // 2. Invalidate detail produk spesifik ini agar cache slug-nya diperbarui
      queryClient.invalidateQueries({ queryKey: ["product", variables.slug] });
    },
  });

  // DELETE PRODUCT (Menggunakan Slug)
  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/product/${slug}`, { method: "DELETE" });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    ...query, // Menyediakan data (list), isLoading, isError, dll.
    createProduct: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProduct: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProduct: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

/**
 * 2. Hook untuk Detail Produk (Ambil Berdasarkan Slug)
 */
export const useProductDetail = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/product/${slug}`);
      if (!res.ok) throw new Error("Produk tidak ditemukan");
      return res.json();
    },
    enabled: !!slug, // Hanya fetch jika slug ada
  });
};
