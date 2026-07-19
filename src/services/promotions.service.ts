import { api } from "@/lib/api";

export const promotionsService = {
  checkCode: async (code: string) => {
    const res = await api.get(`/promotions/check/${code}`);
    return res.data;
  },

  getAll: async () => {
    const res = await api.get("/promotions");
    return res.data;
  },

  create: async (data: any) => {
    const res = await api.post("/promotions", data);
    return res.data;
  },

  update: async (id: number, data: any) => {
    const res = await api.patch(`/promotions/${id}`, data);
    return res.data;
  },

  remove: async (id: number) => {
    const res = await api.delete(`/promotions/${id}`);
    return res.data;
  },
};
