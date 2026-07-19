"use client";
import React, { use, useState } from "react";
import Link from "next/link";
import { useGetBook } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  ChevronRight,
  Star,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "sonner";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const addToCart = useCartStore((state) => state.add);

  const { data: book, isLoading } = useGetBook(id);

  const handleAddToCart = () => {
    if (!book) return;
    addToCart({
      bookId: book.id,
      title: book.title,
      price: Number(book.price),
      stock: book.stock,
      quantity: quantity,
    });
    toast.success("Đã thêm vào giỏ hàng!");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c92127]"></div>
      </div>
    );

  if (!book) {
    return (
      <div className="text-center py-20 text-gray-500 text-xl">
        Sản phẩm không tồn tại hoặc đã bị xóa.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 flex items-center gap-2 mb-2">
        <Link href="/" className="hover:text-[#c92127]">
          Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/products?category=${book?.category?.name || ""}`}
          className="hover:text-[#c92127]"
        >
          {book?.category?.name || "Danh mục"}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium truncate max-w-xs">
          {book.title}
        </span>
      </nav>

      {/* Main Info Box */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col items-center">
            <div className="aspect-[3/4] w-full max-w-[300px] bg-gray-100 rounded-lg flex items-center justify-center border relative overflow-hidden">
              <span className="text-gray-400">Chưa có ảnh</span>
              {/* placeholder img tag */}
            </div>
            <div className="flex justify-center mt-6 space-x-6 w-full">
              <button className="text-gray-600 hover:text-[#c92127] flex items-center text-sm font-medium transition-colors">
                <Heart className="w-5 h-5 mr-2" /> Thêm vào yêu thích
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-3/5 lg:w-2/3 space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 leading-tight mb-2">
                {book.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                <p>
                  Nhà cung cấp:{" "}
                  <span className="font-semibold text-blue-600">FAHASA</span>
                </p>
                <p>
                  Tác giả:{" "}
                  <span className="font-semibold text-gray-800">
                    {book?.author?.name || "Đang cập nhật"}
                  </span>
                </p>
                <p>
                  Thể loại:{" "}
                  <span className="font-semibold text-gray-800">
                    {book?.category?.name || "Đang cập nhật"}
                  </span>
                </p>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-gray-50 p-4 rounded-md flex items-center gap-4">
              <div className="text-3xl font-bold text-[#c92127]">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(book.price || 0)}
              </div>
              {/* Giả lập giá cũ và % giảm */}
              <div className="text-sm text-gray-400 line-through">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format((book.price || 0) * 1.2)}
              </div>
              <div className="bg-[#c92127] text-white text-xs font-bold px-2 py-1 rounded">
                -20%
              </div>
            </div>

            {/* Policies */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                  <Truck className="w-4 h-4" />
                </div>
                <span>Thời gian giao hàng: 2-3 ngày</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                  <Star className="w-4 h-4" />
                </div>
                <span>Chính sách đổi trả: 30 ngày</span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="pt-6 border-t">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-semibold w-24">
                  Số lượng:
                </span>
                <div className="flex items-center border rounded-md bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-12 text-center py-2 focus:outline-none font-semibold text-gray-800 border-x"
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(quantity + 1, book.stock || 1))
                    }
                    className="px-4 py-2 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  ({book.stock || 0} sản phẩm có sẵn)
                </span>
              </div>

              <div className="flex gap-4 max-w-md">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-[#c92127] text-[#c92127] hover:bg-red-50 hover:text-[#c92127] h-12 text-base font-bold shadow-sm"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" /> Thêm vào giỏ hàng
                </Button>
                <Button className="flex-1 bg-[#c92127] hover:bg-red-700 text-white h-12 text-base font-bold shadow-sm">
                  Mua ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-4 font-bold text-sm uppercase transition-colors ${activeTab === "description" ? "text-[#c92127] border-b-2 border-[#c92127]" : "text-gray-500 hover:text-gray-800"}`}
            onClick={() => setActiveTab("description")}
          >
            Mô tả sản phẩm
          </button>
          <button
            className={`px-6 py-4 font-bold text-sm uppercase transition-colors ${activeTab === "reviews" ? "text-[#c92127] border-b-2 border-[#c92127]" : "text-gray-500 hover:text-gray-800"}`}
            onClick={() => setActiveTab("reviews")}
          >
            Đánh giá khách hàng
          </button>
        </div>

        <div className="p-6">
          {activeTab === "description" && (
            <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
              {book.description ||
                "Nhà xuất bản chưa cung cấp thông tin chi tiết cho cuốn sách này."}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <Star className="w-12 h-12 text-gray-300 mb-3" />
              <p>Chưa có đánh giá nào cho sản phẩm này.</p>
              <Button variant="outline" className="mt-4">
                Viết đánh giá
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products - Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 uppercase mb-4">
          Sản phẩm liên quan
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Skeleton placeholders */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-2 border border-transparent hover:border-gray-100 hover:shadow-md rounded-lg transition-all cursor-pointer"
            >
              <div className="aspect-[3/4] bg-gray-100 rounded-md animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mt-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mt-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
