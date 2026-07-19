"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { CreatePurchaseModal } from "@/components/admin/purchase/CreatePurchaseModal";
import { PurchaseDetailModal } from "@/components/admin/purchase/PurchaseDetailModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetBatches } from "@/hooks/useBatches";

export default function PurchasePage() {
  const { data: batches, isLoading } = useGetBatches();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);

  const handleView = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý Nhập kho (Phiếu nhập)
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Tạo Phiếu Nhập
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[100px]">Mã phiếu</TableHead>
              <TableHead>Ngày nhập</TableHead>
              <TableHead>Nhà cung cấp</TableHead>
              <TableHead>Người tạo</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">Đang tải...</TableCell>
              </TableRow>
            ) : batches?.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.code}</TableCell>
                <TableCell>{new Date(p.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>{p.book?.title}</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell className="text-right font-medium text-blue-600">
                  {p.quantity} quyển
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleView(p)} className="text-blue-600">
                    <Eye className="w-4 h-4 mr-1" /> Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreatePurchaseModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <PurchaseDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} purchase={selectedPurchase} />
    </div>
  );
}
