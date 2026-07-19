import { useQuery } from "@tanstack/react-query";
import { statisticsService } from "@/services/statistics.service";
import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

export const useGetOverviewStats = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["admin-statistics"],
    queryFn: statisticsService.getOverview,
    enabled: !!token && user?.role === "ADMIN",
  });
};

export const useGetRevenueStats = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/api/statistics/revenue", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!token,
  });
};

export const useGetStockStats = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["admin-stock"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/api/statistics/stock", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!token,
  });
};
