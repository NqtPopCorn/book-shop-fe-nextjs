'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/lib/order-api';
import { useAuthStore } from '@/stores/auth.store';

export default function OrdersPage() {
  const email = useAuthStore((state) => state.user?.email);
  const { data, isLoading, error } = useQuery({ queryKey: ['orders', email], queryFn: () => orderApi.byEmail(email as string), enabled: Boolean(email) });
  const orders = [...(data?.customer?.orders ?? [])].sort((a, b) => b.order_id - a.order_id);
  return <main className="min-h-screen bg-slate-50 px-6 py-12"><div className="mx-auto max-w-4xl"><Link href="/books" className="text-orange-600">← Tiếp tục mua sắm</Link><h1 className="mt-6 text-3xl font-bold">Đơn hàng của tôi</h1>{!email ? <div className="mt-6 rounded-lg border bg-white p-6"><p>Vui lòng đăng nhập để xem đơn hàng.</p><Link href="/auth/login" className="mt-4 inline-block text-orange-600">Đăng nhập →</Link></div> : isLoading ? <p className="mt-6 text-slate-500">Đang tải đơn hàng...</p> : error ? <p className="mt-6 text-red-600">Không thể tải danh sách đơn hàng.</p> : !orders.length ? <p className="mt-6 text-slate-500">Bạn chưa có đơn hàng nào.</p> : <div className="mt-6 space-y-4">{orders.map((order) => <article key={order.order_id} className="rounded-lg border bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Đơn hàng #{order.order_id}</h2><span className="rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-700">{order.orderstatus?.status_name ?? 'Đang xử lý'}</span></div><p className="mt-2 text-sm text-slate-500">{new Date(order.createdAt).toLocaleString('vi-VN')} · {order.address}</p><ul className="mt-4 space-y-1 text-sm">{(order.batches ?? []).map((batch, index) => <li key={`${order.order_id}-${index}`} className="flex justify-between"><span>{batch.book?.title ?? 'Sản phẩm'} × {batch.orderdetails?.quantity ?? 0}</span><span>{Number(batch.orderdetails?.final_price ?? 0).toLocaleString('vi-VN')}đ</span></li>)}</ul><div className="mt-4 border-t pt-3 text-right font-bold text-orange-600">Tổng: {Number(order.total_amount).toLocaleString('vi-VN')}đ</div></article>)}</div>}</div></main>;
}
