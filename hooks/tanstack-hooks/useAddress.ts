import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddress = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await fetch(`/api/account/address`);
      const result = await res.json();
      return result;
    },
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/account/address", { method: "POST", body: data });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await fetch(`/api/account/address/${id}`, { method: "PUT", body: formData });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/account/address/${id}`, { method: "DELETE" });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  return {
    ...query,
    createAddress: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAddress: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteAddress: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

export const useAddressDetail = (id: string) => {
  return useQuery({
    queryKey: ["address", id],
    queryFn: async () => {
      const res = await fetch(`/api/account/address/${id}`);
      const result = await res.json();
      return result;
    },
    enabled: !!id,
  });
};
