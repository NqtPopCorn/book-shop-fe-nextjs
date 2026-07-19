import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { promotionsService } from "@/services/promotions.service";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

export const useCheckPromotion = () => {
  return useMutation({
    mutationFn: promotionsService.checkCode,
  });
};

export const useGetPromotions = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["admin-promotions"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/api/promotions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });
};

export const useGetPromotion = (id: string) => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["admin-promotion", id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8080/api/promotions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data;
    },
    enabled: !!token && !!id && id !== "create",
  });
};

export const useCreatePromotion = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post(
        "http://localhost:8080/api/promotions",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
    },
  });
};

export const useUpdatePromotion = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await axios.patch(
        `http://localhost:8080/api/promotions/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
    },
  });
};

export const useDeletePromotion = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(
        `http://localhost:8080/api/promotions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
    },
  });
};
