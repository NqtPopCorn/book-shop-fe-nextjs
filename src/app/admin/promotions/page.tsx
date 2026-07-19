"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPromotions, useDeletePromotion } from "@/hooks/usePromotions";
import { toast } from "sonner";
import { PromotionFormModal } from "@/components/admin/promotions/PromotionFormModal";

export default function PromotionsPage() {
  const { data: promotions, isLoading } = useGetPromotions();
  const deletePromotion = useDeletePromotion();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<any>(null);

  const handleDelete = (id: number) => {
    if (confirm("Xóa mã khuyến mãi này?")) {
      deletePromotion.mutate(id, {
        onSuccess: () => toast.success("Đã xóa"),
        onError: () => toast.error("Có lỗi xảy ra")
      });
    }
  };

  const handleEdit = (promo: any) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPromo(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Khuyến mãi</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Thêm Khuyến mãi
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Tên CTKM</TableHead>
              <TableHead>Mã giảm giá</TableHead>
              <TableHead>Mức giảm</TableHead>
              <TableHead>Thời gian áp dụng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">Đang tải...</TableCell>
              </TableRow>
            ) : promotions?.map((promo: any) => (
              <TableRow key={promo.id}>
                <TableCell className="font-medium">Mã KM #{promo.id}</TableCell>
                <TableCell><span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{promo.code}</span></TableCell>
                <TableCell className="text-orange-600 font-bold">{promo.percentage ? `${promo.percentage}%` : 'Theo Rule'}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(promo.createdAt).toLocaleDateString("vi-VN")} - {promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString("vi-VN") : "Không thời hạn"}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {promo.active ? "Hoạt động" : "Tạm dừng"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-blue-600 hover:text-blue-900 mr-4" onClick={() => handleEdit(promo)}>
                    <Edit className="w-4 h-4 inline" />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(promo.id)}
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <PromotionFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promotion={selectedPromo}
      />
    </div>
  );
}
