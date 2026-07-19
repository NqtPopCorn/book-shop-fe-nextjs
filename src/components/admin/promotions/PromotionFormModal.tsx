"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreatePromotion, useUpdatePromotion } from "@/hooks/usePromotions";

interface PromotionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion?: any;
}

export function PromotionFormModal({ isOpen, onClose, promotion }: PromotionFormModalProps) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();
  const [conditionsJson, setConditionsJson] = useState("");
  const [actionsJson, setActionsJson] = useState("");

  useEffect(() => {
    if (promotion) {
      reset(promotion);
      setConditionsJson(promotion.conditions ? JSON.stringify(promotion.conditions, null, 2) : "");
      setActionsJson(promotion.actions ? JSON.stringify(promotion.actions, null, 2) : "");
      if (promotion.expiresAt) {
        setValue("expiresAt", new Date(promotion.expiresAt).toISOString().split("T")[0]);
      }
    } else {
      reset({ code: "", percentage: 0, maxUses: "", expiresAt: "" });
      setConditionsJson("");
      setActionsJson("");
    }
  }, [promotion, isOpen, reset, setValue]);

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      percentage: data.percentage ? Number(data.percentage) : undefined,
      maxUses: data.maxUses ? Number(data.maxUses) : undefined,
      expiresAt: data.expiresAt || undefined,
    };

    try {
      if (conditionsJson) payload.conditions = JSON.parse(conditionsJson);
      if (actionsJson) payload.actions = JSON.parse(actionsJson);
    } catch (e) {
      toast.error("JSON không hợp lệ");
      return;
    }

    if (promotion?.id) {
      updateMutation.mutate({ id: promotion.id, data: payload }, {
        onSuccess: () => {
          toast.success("Cập nhật thành công");
          onClose();
        },
        onError: () => toast.error("Cập nhật thất bại")
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Thêm thành công");
          onClose();
        },
        onError: () => toast.error("Thêm thất bại")
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{promotion ? "Sửa Khuyến Mãi" : "Thêm Khuyến Mãi"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mã giảm giá</Label>
              <Input {...register("code", { required: true })} placeholder="VD: SUMMER2026" />
            </div>
            <div className="space-y-2">
              <Label>Mức giảm (%)</Label>
              <Input type="number" {...register("percentage")} placeholder="VD: 10" />
            </div>
            <div className="space-y-2">
              <Label>Lượt sử dụng tối đa</Label>
              <Input type="number" {...register("maxUses")} placeholder="VD: 100" />
            </div>
            <div className="space-y-2">
              <Label>Ngày hết hạn</Label>
              <Input type="date" {...register("expiresAt")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Điều kiện (JSON)</Label>
            <textarea
              className="w-full h-32 p-2 border rounded-md font-mono text-sm"
              value={conditionsJson}
              onChange={(e) => setConditionsJson(e.target.value)}
              placeholder='{"all": [{"fact": "subtotal", "operator": "greaterThan", "value": 500000}]}'
            />
          </div>

          <div className="space-y-2">
            <Label>Hành động (JSON)</Label>
            <textarea
              className="w-full h-32 p-2 border rounded-md font-mono text-sm"
              value={actionsJson}
              onChange={(e) => setActionsJson(e.target.value)}
              placeholder='{"type": "order_percentage", "value": 10}'
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              Lưu Khuyến Mãi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
