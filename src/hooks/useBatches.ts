import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

export const useGetBatches = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["admin-batches"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/api/batches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });
};

export const useCreateBatch = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      code: string;
      bookId: number;
      quantity: number;
    }) => {
      const res = await axios.post(`http://localhost:8080/api/batches`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-batches"] });
      // Invalidate stock to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ["admin-stock"] });
      // Invalidate books to update product list
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
    },
  });
};
