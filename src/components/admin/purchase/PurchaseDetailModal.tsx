"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PurchaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: any;
}

export function PurchaseDetailModal({ isOpen, onClose, purchase }: PurchaseDetailModalProps) {
  if (!purchase) return null;

  // Mock items
  const items = purchase.items || [
    { title: "Sách Khoa Học 1", quantity: 50, price: 80000 },
    { title: "Tiểu Thuyết Bán Chạy", quantity: 100, price: 65000 }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết phiếu nhập #{purchase.id}</DialogTitle>
          <DialogDescription>
            Thông tin nhà cung cấp và các sản phẩm đã nhập kho.
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-lg p-4 bg-gray-50 mt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Mã phiếu:</p>
              <p className="font-medium">#{purchase.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Ngày nhập:</p>
              <p className="font-medium">{new Date(purchase.date).toLocaleDateString("vi-VN")}</p>
            </div>
            <div>
              <p className="text-gray-500">Nhà cung cấp:</p>
              <p className="font-medium">{purchase.provider}</p>
            </div>
            <div>
              <p className="text-gray-500">Người tạo:</p>
              <p className="font-medium">{purchase.creator || "Admin"}</p>
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
                  <th className="px-4 py-3 text-right">Giá nhập</th>
                  <th className="px-4 py-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.title}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{item.price.toLocaleString("vi-VN")} đ</td>
                    <td className="px-4 py-3 text-right font-medium">{(item.price * item.quantity).toLocaleString("vi-VN")} đ</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-semibold text-gray-800 border-t-2">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right">Tổng cộng</td>
                  <td className="px-4 py-3 text-right text-lg text-blue-600">
                    {Number(purchase.total).toLocaleString("vi-VN")} đ
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
