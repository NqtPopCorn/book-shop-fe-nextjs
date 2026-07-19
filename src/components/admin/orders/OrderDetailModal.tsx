"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  if (!order) return null;

  // Mock order items if not provided by backend yet
  const mockItems = [
    { book: { title: "Sách Mẫu 1" }, quantity: 2, unitPrice: 150000 },
    { book: { title: "Sách Mẫu 2" }, quantity: 1, unitPrice: 85000 }
  ];

  const items = (order.items && order.items.length > 0) ? order.items : mockItems;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng #{order.id}</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về khách hàng và các sản phẩm trong đơn.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Thông tin khách hàng</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium text-gray-800">Email:</span> {order.user?.email || "Khách vãng lai"}</p>
              <p><span className="font-medium text-gray-800">Họ tên:</span> {order.user?.name || "Nguyễn Văn A"}</p>
              <p><span className="font-medium text-gray-800">Số điện thoại:</span> {order.user?.phone || "0912345678"}</p>
              <p><span className="font-medium text-gray-800">Địa chỉ giao hàng:</span> {order.address || "123 Đường ABC, Quận 1, TP. HCM"}</p>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Thông tin đơn hàng</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium text-gray-800">Mã đơn:</span> #{order.id}</p>
              <p><span className="font-medium text-gray-800">Ngày đặt:</span> {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
              <p><span className="font-medium text-gray-800">Trạng thái:</span> <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">{order.status}</span></p>
              <p><span className="font-medium text-gray-800">Phương thức thanh toán:</span> COD</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-3">Danh sách sản phẩm</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3">Tên sản phẩm</th>
                  <th className="px-4 py-3 text-center">Số lượng</th>
                  <th className="px-4 py-3 text-right">Đơn giá</th>
                  <th className="px-4 py-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.book?.title || item.title}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{Number(item.unitPrice || item.price).toLocaleString("vi-VN")} đ</td>
                    <td className="px-4 py-3 text-right font-medium">{(Number(item.unitPrice || item.price) * item.quantity).toLocaleString("vi-VN")} đ</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-semibold text-gray-800 border-t-2">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right">Tổng tiền</td>
                  <td className="px-4 py-3 text-right text-lg text-blue-600">
                    {Number(order.total).toLocaleString("vi-VN")} đ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
