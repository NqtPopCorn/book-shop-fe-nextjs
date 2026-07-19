import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { booksService } from "@/services/books.service";

export const useGetBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: booksService.getAll,
  });
};

export const useGetBook = (id: string) => {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => booksService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: booksService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      booksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: booksService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
    },
  });
};
