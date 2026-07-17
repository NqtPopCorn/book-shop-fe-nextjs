'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cart.store';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const remove = useCartStore((state) => state.remove);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const total = useCartStore((state) => state.total());

  return <main className="min-h-screen bg-slate-50 px-6 py-12"><div className="mx-auto max-w-3xl"><Link href="/books" className="text-orange-600">← Tiếp tục mua sắm</Link><h1 className="mt-6 text-3xl font-bold">Giỏ hàng</h1>{items.length === 0 ? <p className="mt-6 text-slate-500">Giỏ hàng đang trống.</p> : <div className="mt-6 space-y-3">{items.map((item) => <div key={item.bookId} className="flex items-center justify-between rounded-lg border bg-white p-4"><div><p className="font-medium">{item.title}</p><p className="text-sm text-slate-500">{item.price.toLocaleString('vi-VN')}đ / cuốn</p><div className="mt-2 flex items-center gap-2"><button type="button" onClick={() => setQuantity(item.bookId, item.quantity - 1)} className="rounded border px-2">−</button><span>{item.quantity}</span><button type="button" onClick={() => setQuantity(item.bookId, item.quantity + 1)} className="rounded border px-2">+</button></div></div><button type="button" onClick={() => remove(item.bookId)} className="text-sm text-red-600">Xóa</button></div>)}<div className="flex justify-between border-t pt-5 text-xl font-bold"><span>Tổng</span><span className="text-orange-600">{total.toLocaleString('vi-VN')}đ</span></div><Link href="/checkout" className="block rounded bg-orange-600 px-4 py-3 text-center font-semibold text-white">Tiến hành thanh toán</Link></div>}</div></main>;
}
