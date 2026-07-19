import { api } from "@/lib/api";

export const ordersService = {
  create: async (data: {
    items: { bookId: number; quantity: number }[];
    promotionCode?: string;
  }) => {
    const res = await api.post("/orders", data);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get("/orders/mine");
    return res.data;
  },
  getAdminOrders: async () => {
    const res = await api.get("/admin/orders");
    return res.data;
  },
  updateStatus: async (id: number, status: string) => {
    const res = await api.patch(`/admin/orders/${id}/status`, { status });
    return res.data;
  },
};
