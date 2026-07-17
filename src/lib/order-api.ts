import { api } from '@/lib/api';

export type CreateOrderInput = {
  email: string;
  order: { total_amount: number; status_id: number; address: string; billPromotion_id: number | null };
  orderDetails: Array<{ book_id: number; quantity: number; price: number; discount_id: number | null }>;
};

export type Order = {
  order_id: number;
  total_amount: number;
  address: string;
  createdAt: string;
  orderstatus?: { status_name?: string };
  batches?: Array<{ book?: { title?: string }; orderdetails?: { quantity?: number; final_price?: number } }>;
};

export const orderApi = {
  create: (input: CreateOrderInput) => api.post('/cart/order', input).then((response) => response.data),
  byEmail: (email: string) => api.get<{ error: number; customer?: { orders?: Order[] } }>('/order/order-by-email', { params: { email } }).then((response) => response.data),
};
