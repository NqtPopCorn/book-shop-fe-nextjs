"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateBook, useUpdateBook } from "@/hooks/useBooks";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any; // If provided, it's edit mode
}

export function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const isEdit = !!product;
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Convert to JSON
    const data = {
      title: formData.get("title") as string,
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      description: formData.get("description") as string,
      // For a real API, author might need authorId, but we send what API accepts. 
      // For now we'll send it simply or omit complex relations if backend doesn't support nested create.
    };

    if (isEdit) {
      updateBook.mutate({ id: product.id, data }, {
        onSuccess: () => {
          toast.success("Cập nhật sản phẩm thành công");
          onClose();
        },
        onError: () => toast.error("Có lỗi xảy ra khi cập nhật")
      });
    } else {
      createBook.mutate(data, {
        onSuccess: () => {
          toast.success("Thêm sản phẩm thành công");
          onClose();
        },
        onError: () => toast.error("Có lỗi xảy ra khi thêm")
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Chỉnh sửa Sách" : "Thêm Sách Mới"}</DialogTitle>
          <DialogDescription>
            Điền các thông tin chi tiết về sách dưới đây. Bấm Lưu để hoàn tất.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tên sách</Label>
              <Input id="title" name="title" defaultValue={product?.title || ""} placeholder="Nhập tên sách" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ)</Label>
              <Input id="price" name="price" type="number" defaultValue={product?.price || ""} placeholder="VD: 150000" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Tác giả (ID hoặc Tên)</Label>
              <Input id="author" name="author" defaultValue={product?.author?.name || ""} placeholder="Tên tác giả" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Tồn kho</Label>
              <Input id="stock" name="stock" type="number" defaultValue={product?.stock || ""} placeholder="Số lượng" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher">Nhà xuất bản</Label>
              <Input id="publisher" name="publisher" placeholder="Nhà xuất bản" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Năm xuất bản</Label>
              <Input id="year" type="number" placeholder="VD: 2024" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">Số trang</Label>
              <Input id="pages" type="number" placeholder="VD: 300" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Kích thước</Label>
              <Input id="size" placeholder="VD: 14x20cm" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <textarea 
              id="description" 
              name="description"
              defaultValue={product?.description || ""}
              className="w-full min-h-[100px] border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Nhập mô tả về cuốn sách..."
            />
          </div>

          <div className="space-y-2">
            <Label>Hình ảnh minh họa</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">Click hoặc kéo thả ảnh vào đây</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={createBook.isPending || updateBook.isPending}>
              {createBook.isPending || updateBook.isPending ? "Đang lưu..." : "Lưu Sản Phẩm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
