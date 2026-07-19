"use client";

import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetAdminOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { OrderDetailModal } from "@/components/admin/orders/OrderDetailModal";
import { useState } from "react";

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useGetAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Đang tải danh sách đơn hàng...
      </div>
    );

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    SHIPPING: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[100px]">Mã ĐH</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-gray-500"
                >
                  Chưa có đơn hàng nào
                </TableCell>
              </TableRow>
            ) : (
              orders?.map((order: any) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewOrder(order)}
                >
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.user?.email}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {Number(order.total).toLocaleString("vi-VN")} đ
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {order.status === "PENDING" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateStatus.mutate({
                              id: order.id,
                              status: "CONFIRMED",
                            })
                          }
                        >
                          Xác nhận
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            updateStatus.mutate({
                              id: order.id,
                              status: "CANCELLED",
                            })
                          }
                        >
                          Hủy
                        </Button>
                      </>
                    )}
                    {order.status === "CONFIRMED" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          updateStatus.mutate({
                            id: order.id,
                            status: "SHIPPING",
                          })
                        }
                      >
                        Giao hàng
                      </Button>
                    )}
                    {order.status === "SHIPPING" && (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          updateStatus.mutate({
                            id: order.id,
                            status: "COMPLETED",
                          })
                        }
                      >
                        Hoàn thành
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
