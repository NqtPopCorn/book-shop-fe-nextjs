import { api } from "@/lib/api";

export const booksService = {
  getAll: async () => {
    const res = await api.get("/books");
    return res.data;
  },
  getById: async (id: string | number) => {
    const res = await api.get(`/books/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post("/books", data);
    return res.data;
  },
  update: async (id: number | string, data: any) => {
    const res = await api.patch(`/books/${id}`, data);
    return res.data;
  },
  delete: async (id: number | string) => {
    const res = await api.delete(`/books/${id}`);
    return res.data;
  },
};
