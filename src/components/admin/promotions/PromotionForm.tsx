"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreatePromotion, useUpdatePromotion } from "@/hooks/usePromotions";
import { Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductSelectionTable } from "./ProductSelectionTable";

interface PromotionFormProps {
  promotion?: any;
}

export function PromotionForm({ promotion }: PromotionFormProps) {
  const router = useRouter();
  const { register, handleSubmit, reset, setValue } = useForm();
  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();

  const [rules, setRules] = useState<any[]>([]);
  const [actionType, setActionType] = useState<string>("order_percentage");
  const [actionValue, setActionValue] = useState<string>("");
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);

  useEffect(() => {
    if (promotion) {
      reset(promotion);

      if (
        promotion.conditions?.all &&
        Array.isArray(promotion.conditions.all)
      ) {
        setRules(promotion.conditions.all);
      } else {
        setRules([]);
      }

      if (promotion.actions) {
        setActionType(promotion.actions.type || "order_percentage");
        if (promotion.actions.type === "line_item_percentage") {
          setActionValue(String(promotion.actions.value?.percentage || ""));
          setSelectedVariants(promotion.actions.value?.variantIds || []);
        } else {
          setActionValue(String(promotion.actions.value || ""));
          setSelectedVariants([]);
        }
      } else {
        setActionType("order_percentage");
        setActionValue("");
        setSelectedVariants([]);
      }

      if (promotion.expiresAt) {
        setValue(
          "expiresAt",
          new Date(promotion.expiresAt).toISOString().split("T")[0],
        );
      }
    } else {
      reset({ code: "", percentage: 0, maxUses: "", expiresAt: "" });
      setRules([]);
      setActionType("order_percentage");
      setActionValue("");
      setSelectedVariants([]);
    }
  }, [promotion, reset, setValue]);

  const onSubmit = (data: any) => {
    const payload: any = {
      ...data,
      percentage: data.percentage ? Number(data.percentage) : undefined,
      maxUses: data.maxUses ? Number(data.maxUses) : undefined,
      expiresAt: data.expiresAt || undefined,
    };

    if (rules.length > 0) {
      payload.conditions = {
        all: rules.map((r) => ({
          ...r,
          value: Number(r.value),
        })),
      };
    } else {
      payload.conditions = { all: [] };
    }

    if (actionType && actionValue !== "") {
      if (actionType === "line_item_percentage") {
        payload.actions = {
          type: actionType,
          value: {
            percentage: Number(actionValue),
            variantIds: selectedVariants,
          },
        };
      } else {
        payload.actions = {
          type: actionType,
          value: Number(actionValue),
        };
      }
    }

    if (promotion?.id) {
      updateMutation.mutate(
        { id: promotion.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Cập nhật thành công");
            router.push("/admin/promotions");
          },
          onError: () => toast.error("Cập nhật thất bại"),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Thêm thành công");
          router.push("/admin/promotions");
        },
        onError: () => toast.error("Thêm thất bại"),
      });
    }
  };

  const handleCancel = () => {
    router.push("/admin/promotions");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg border shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Mã giảm giá</Label>
          <Input
            {...register("code", { required: true })}
            placeholder="VD: SUMMER2026"
          />
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

      <div className="space-y-4 border p-4 rounded-md bg-slate-50 dark:bg-slate-900">
        <div className="flex justify-between items-center">
          <Label className="text-base font-semibold">Điều kiện áp dụng</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setRules([
                ...rules,
                {
                  fact: "subtotal",
                  operator: "greaterThanInclusive",
                  value: "",
                },
              ])
            }
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm điều kiện
          </Button>
        </div>

        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="flex gap-2 items-center flex-wrap md:flex-nowrap"
            >
              <Select
                value={rule.fact}
                onValueChange={(val) => {
                  const newRules = [...rules];
                  newRules[index].fact = val;
                  setRules(newRules);
                }}
              >
                <SelectTrigger className="w-full md:w-[220px] bg-background">
                  <SelectValue placeholder="Chọn thuộc tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subtotal">Tổng tiền đơn hàng</SelectItem>
                  <SelectItem value="itemCount">Số lượng sản phẩm</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={rule.operator}
                onValueChange={(val) => {
                  const newRules = [...rules];
                  newRules[index].operator = val;
                  setRules(newRules);
                }}
              >
                <SelectTrigger className="w-full md:w-[220px] bg-background">
                  <SelectValue placeholder="Phép so sánh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greaterThan">&gt; (Lớn hơn)</SelectItem>
                  <SelectItem value="greaterThanInclusive">
                    &gt;= (Lớn hơn/bằng)
                  </SelectItem>
                  <SelectItem value="lessThan">&lt; (Nhỏ hơn)</SelectItem>
                  <SelectItem value="lessThanInclusive">
                    &lt;= (Nhỏ hơn/bằng)
                  </SelectItem>
                  <SelectItem value="equal">= (Bằng)</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Giá trị..."
                className="flex-1 min-w-[150px] bg-background"
                value={rule.value}
                onChange={(e) => {
                  const newRules = [...rules];
                  newRules[index].value = e.target.value;
                  setRules(newRules);
                }}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newRules = [...rules];
                  newRules.splice(index, 1);
                  setRules(newRules);
                }}
              >
                <Trash className="w-5 h-5 text-red-500" />
              </Button>
            </div>
          ))}
          {rules.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Không có điều kiện nào. Khuyến mãi áp dụng cho mọi đơn hàng.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 border p-4 rounded-md bg-slate-50 dark:bg-slate-900">
        <Label className="text-base font-semibold">Hình thức khuyến mãi</Label>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <Label>Loại giảm giá</Label>
            <Select
              value={actionType}
              onValueChange={(val) => setActionType(val)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Chọn loại giảm giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order_percentage">
                  Giảm theo % đơn hàng
                </SelectItem>
                <SelectItem value="line_item_percentage">
                  Giảm % theo sản phẩm chọn lọc
                </SelectItem>
                <SelectItem value="order_fixed">
                  Giảm số tiền cố định
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label>Mức giảm</Label>
            <Input
              type="number"
              className="bg-background"
              placeholder={
                actionType === "order_fixed" ? "VD: 50000" : "VD: 10"
              }
              value={actionValue}
              onChange={(e) => setActionValue(e.target.value)}
            />
          </div>
        </div>

        {actionType === "line_item_percentage" && (
          <div className="mt-6 border-t pt-4">
            <div className="mb-4 flex items-center justify-between">
              <Label className="block text-base font-semibold text-blue-700">
                Chọn sản phẩm áp dụng
              </Label>
              <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Đã chọn: {selectedVariants.length} sản phẩm
              </span>
            </div>
            <ProductSelectionTable
              selectedVariantIds={selectedVariants}
              onChange={setSelectedVariants}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Hủy Bỏ
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {promotion ? "Cập Nhật" : "Tạo Mới"}
        </Button>
      </div>
    </form>
  );
}
