"use client";

import React from "react";
import { useParams } from "next/navigation";
import { PromotionForm } from "@/components/admin/promotions/PromotionForm";
import { useGetPromotion } from "@/hooks/usePromotions";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPromotionPage() {
  const { id } = useParams();
  const { data: promotion, isLoading, isError } = useGetPromotion(id as string);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Đang tải dữ liệu khuyến mãi...
      </div>
    );
  }

  if (isError || !promotion) {
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy khuyến mãi này.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href="/admin/promotions"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Sửa Khuyến mãi: {promotion.code}
        </h1>
        <p className="text-muted-foreground mt-1">
          Cập nhật thông tin chi tiết cho mã giảm giá.
        </p>
      </div>
      <PromotionForm promotion={promotion} />
    </div>
  );
}
