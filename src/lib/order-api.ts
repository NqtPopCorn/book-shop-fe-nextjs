import { api } from '@/lib/api';

export type CreateOrderInput = {
  email: string;
  order: {
    total_amount: number;
    status_id: number;
    address: string;
    billPromotion_id: number | null;
  };
  orderDetails: Array<{
    book_id: number;
    quantity: number;
    price: number;
    discount_id: number | null;
  }>;
};

export const orderApi = {
  create: (input: CreateOrderInput) =>
    api.post('/cart/order', input).then((response) => response.data),
};
