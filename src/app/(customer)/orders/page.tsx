"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { useGetMyOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Clock,
  XCircle,
  CheckCircle,
} from "lucide-react";

export default function OrdersPage() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, error } = useGetMyOrders();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const orders = Array.isArray(data) ? data : [];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Chờ xác nhận",
          color: "text-orange-500",
          bg: "bg-orange-50",
          icon: Clock,
        };
      case "PROCESSING":
        return {
          label: "Đang xử lý",
          color: "text-blue-500",
          bg: "bg-blue-50",
          icon: Package,
        };
      case "DELIVERED":
        return {
          label: "Đã giao",
          color: "text-green-500",
          bg: "bg-green-50",
          icon: CheckCircle,
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          color: "text-red-500",
          bg: "bg-red-50",
          icon: XCircle,
        };
      default:
        return {
          label: status,
          color: "text-gray-500",
          bg: "bg-gray-50",
          icon: Package,
        };
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <img
          src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/login.png"
          alt="Login"
          className="w-32 mb-6 opacity-50"
        />
        <p className="text-gray-500 mb-6 text-lg">
          Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.
        </p>
        <Link href="/login">
          <Button className="bg-[#c92127] hover:bg-red-700 text-white px-8 h-12 text-lg font-bold">
            ĐĂNG NHẬP
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 uppercase border-b pb-4">
        Đơn hàng của tôi
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c92127]"></div>
        </div>
      ) : error ? (
        <p className="text-center py-10 text-red-500">
          Đã xảy ra lỗi khi tải danh sách đơn hàng.
        </p>
      ) : orders.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm flex flex-col items-center justify-center border border-gray-100">
          <Package className="w-20 h-20 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-6 text-lg">
            Bạn chưa có đơn hàng nào.
          </p>
          <Link href="/">
            <Button className="bg-[#c92127] hover:bg-red-700 text-white px-8 h-12 text-lg font-bold">
              MUA SẮM NGAY
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order Summary Header */}
                <div
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                        Mã đơn hàng
                      </p>
                      <p className="font-bold text-gray-800">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                        Ngày đặt
                      </p>
                      <p className="text-gray-800 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                        Tổng tiền
                      </p>
                      <p className="font-bold text-[#c92127]">
                        {Number(order.total).toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig.color} ${statusConfig.bg}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig.label}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Order Details Expanded */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Chi tiết sản phẩm
                    </h4>
                    <div className="space-y-4">
                      {order.items?.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex gap-4 items-center bg-white p-3 rounded border border-gray-100"
                        >
                          <div className="w-16 h-20 bg-gray-100 rounded border flex shrink-0 items-center justify-center">
                            <span className="text-[10px] text-gray-400">
                              No Image
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 line-clamp-2">
                              {item.book?.title ?? "Sản phẩm không xác định"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#c92127]">
                              {Number(
                                item.unitPrice * item.quantity,
                              ).toLocaleString("vi-VN")}{" "}
                              đ
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.status === "PENDING" && (
                      <div className="mt-6 flex justify-end">
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          Hủy đơn hàng
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
