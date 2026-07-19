"use client";

import React from "react";
import { PromotionForm } from "@/components/admin/promotions/PromotionForm";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreatePromotionPage() {
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
          Thêm Khuyến mãi mới
        </h1>
        <p className="text-muted-foreground mt-1">
          Thiết lập mã giảm giá, điều kiện áp dụng và sản phẩm ưu đãi.
        </p>
      </div>
      <PromotionForm />
    </div>
  );
}
