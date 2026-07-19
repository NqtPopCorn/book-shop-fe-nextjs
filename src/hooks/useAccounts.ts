import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

export const useGetAccounts = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["admin-accounts"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/api/account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });
};

export const useUpdateAccountStatus = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await axios.patch(
        `http://localhost:8080/api/account/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
    },
  });
};
