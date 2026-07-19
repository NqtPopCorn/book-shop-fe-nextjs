import { api } from "@/lib/api";

export const statisticsService = {
  getOverview: async () => {
    const res = await api.get("/statistics/overview");
    return res.data;
  },
};
