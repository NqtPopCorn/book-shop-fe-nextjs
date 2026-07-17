'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { orderApi } from '@/lib/order-api';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const clear = useCartStore((state) => state.clear);
  const user = useAuthStore((state) => state.user);
  const [email, setEmail] = useState(user?.email ?? '');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return toast.error('Giỏ hàng đang trống.');
    setSubmitting(true);
    try {
      await orderApi.create({
        email: email.trim(),
        order: { total_amount: total, status_id: 1, address: address.trim(), billPromotion_id: null },
        orderDetails: items.map((item) => ({ book_id: item.bookId, quantity: item.quantity, price: item.price, discount_id: null })),
      });
      clear();
      toast.success('Đặt hàng thành công.');
      router.push('/books');
    } catch (error) {
      console.error(error);
      toast.error('Không thể tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/cart" className="text-orange-600">← Quay lại giỏ hàng</Link>
        <h1 className="mt-6 text-3xl font-bold">Thanh toán</h1>
        {!items.length ? <p className="mt-6 text-slate-500">Giỏ hàng đang trống.</p> : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-lg border bg-white p-6 shadow-sm">
            <div><label htmlFor="email" className="mb-1 block font-medium">Email nhận thông tin đơn hàng</label><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border px-3 py-2" /></div>
            <div><label htmlFor="address" className="mb-1 block font-medium">Địa chỉ nhận hàng</label><textarea id="address" required minLength={5} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded border px-3 py-2" rows={3} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" /></div>
            <div className="flex items-center justify-between border-t pt-5 text-xl font-bold"><span>Tổng thanh toán</span><span className="text-orange-600">{total.toLocaleString('vi-VN')}đ</span></div>
            <button disabled={submitting} className="w-full rounded bg-orange-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Đang tạo đơn...' : 'Đặt hàng'}</button>
          </form>
        )}
      </div>
    </main>
  );
}
