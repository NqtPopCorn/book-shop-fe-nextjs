"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cart.store";
import { Trash2, Plus, Minus, ArrowRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const remove = useCartStore((state) => state.remove);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const total = useCartStore((state) => state.total());

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800 uppercase">
        Giỏ hàng ({totalItems} sản phẩm)
      </h1>

      {items.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm flex flex-col items-center justify-center">
          <img
            src="https://cdn0.fahasa.com/skin//frontend/ma_vanese/fahasa/images/checkout_cart/ico_emptycart.svg"
            alt="Empty Cart"
            className="w-40 mb-4"
          />
          <p className="text-gray-500 mb-6 text-lg">
            Chưa có sản phẩm trong giỏ hàng của bạn.
          </p>
          <Link href="/">
            <Button className="bg-[#c92127] hover:bg-red-700 text-white px-8 h-12 text-lg font-bold">
              MUA SẮM NGAY
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Cart Items */}
          <div className="w-full lg:w-2/3 space-y-4">
            {/* Header row */}
            <div className="bg-white p-4 rounded-lg shadow-sm hidden md:flex items-center text-gray-500 font-medium">
              <div className="w-1/2">Sản phẩm</div>
              <div className="w-1/6 text-center">Đơn giá</div>
              <div className="w-1/6 text-center">Số lượng</div>
              <div className="w-1/6 text-center">Thành tiền</div>
              <div className="w-12"></div>
            </div>

            {/* Cart Items List */}
            {items.map((item) => (
              <div
                key={item.variantId}
                className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-4 relative"
              >
                {/* Product Info */}
                <div className="w-full md:w-1/2 flex items-center gap-4">
                  <div className="w-20 h-28 bg-gray-100 rounded border flex shrink-0 items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Link
                      href={`/books/${item.bookId}`}
                      className="font-medium text-gray-800 hover:text-[#c92127] line-clamp-2"
                    >
                      {item.title}
                    </Link>
                  </div>
                </div>

                {/* Price (Mobile & Desktop) */}
                <div className="w-full md:w-1/6 flex md:justify-center items-center justify-between">
                  <span className="md:hidden text-gray-500">Đơn giá:</span>
                  <span className="font-bold text-gray-800">
                    {item.price.toLocaleString("vi-VN")} đ
                  </span>
                </div>

                {/* Quantity */}
                <div className="w-full md:w-1/6 flex md:justify-center items-center justify-between">
                  <span className="md:hidden text-gray-500">Số lượng:</span>
                  <div className="flex items-center border rounded-md">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.variantId, item.quantity - 1)
                      }
                      className="px-3 py-1.5 hover:bg-gray-100 text-gray-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={item.quantity}
                      className="w-10 text-center py-1.5 font-medium text-gray-800 border-x text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.variantId, item.quantity + 1)
                      }
                      className="px-3 py-1.5 hover:bg-gray-100 text-gray-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="w-full md:w-1/6 flex md:justify-center items-center justify-between">
                  <span className="md:hidden text-gray-500">Thành tiền:</span>
                  <span className="font-bold text-[#c92127]">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => remove(item.variantId)}
                  className="absolute top-4 right-4 md:static md:w-12 flex justify-end text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              {/* Promo Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#c92127] mb-3">
                  <Ticket className="w-5 h-5" />
                  <span className="font-semibold uppercase text-sm">
                    Khuyến mãi
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã khuyến mãi"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#c92127]"
                  />
                  <Button
                    variant="outline"
                    className="border-[#c92127] text-[#c92127] hover:bg-red-50"
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Thành tiền</span>
                  <span>{total.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển (Giao hàng tiêu chuẩn)</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                  <span className="font-bold text-gray-800 text-lg">
                    Tổng Số Tiền (gồm VAT)
                  </span>
                  <span className="text-3xl font-bold text-[#c92127]">
                    {total.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full bg-[#c92127] hover:bg-red-700 text-white h-14 text-xl font-bold shadow-md flex items-center justify-center gap-2">
                  THANH TOÁN <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <div className="mt-4 text-center text-sm text-gray-500">
                (Xin vui lòng kiểm tra lại đơn hàng trước khi Đặt Mua)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
