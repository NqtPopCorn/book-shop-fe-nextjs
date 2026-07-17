import Link from 'next/link';
export default function CartPage() { return <main className="min-h-screen p-8"><h1 className="text-3xl font-bold">Giỏ hàng</h1><p className="mt-4 text-slate-500">Giỏ hàng sẽ được hiển thị tại đây.</p><Link href="/books" className="mt-6 inline-block text-orange-600">Tiếp tục mua sắm →</Link></main> }
