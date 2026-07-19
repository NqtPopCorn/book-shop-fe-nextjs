import React, { useState, useMemo } from "react";
import { useGetBooks } from "@/hooks/useBooks";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProductSelectionTableProps {
  selectedVariantIds: number[];
  onChange: (selectedIds: number[]) => void;
}

export function ProductSelectionTable({
  selectedVariantIds,
  onChange,
}: ProductSelectionTableProps) {
  const { data: books, isLoading } = useGetBooks();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedPublisher, setSelectedPublisher] = useState<string>("ALL");

  // Flatten books into variants and extract unique categories & publishers
  const { variants, categories, publishers } = useMemo(() => {
    if (!books) return { variants: [], categories: [], publishers: [] };

    const flatVariants: any[] = [];
    const catSet = new Set<string>();
    const pubSet = new Set<string>();

    books.forEach((book: any) => {
      if (book.category?.name) catSet.add(book.category.name);
      if (book.publisher) pubSet.add(book.publisher);

      book.variants?.forEach((variant: any) => {
        flatVariants.push({
          ...variant,
          bookTitle: book.title,
          categoryName: book.category?.name || "Khác",
          publisher: book.publisher || "Khác",
        });
      });
    });

    return {
      variants: flatVariants,
      categories: Array.from(catSet),
      publishers: Array.from(pubSet),
    };
  }, [books]);

  // Apply filters
  const filteredVariants = useMemo(() => {
    return variants.filter((v: any) => {
      const matchSearch =
        v.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategory === "ALL" || v.categoryName === selectedCategory;
      const matchPub =
        selectedPublisher === "ALL" || v.publisher === selectedPublisher;
      return matchSearch && matchCat && matchPub;
    });
  }, [variants, searchTerm, selectedCategory, selectedPublisher]);

  // Handlers
  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      // Add all currently filtered variants that are not already selected
      const filteredIds = filteredVariants.map((v) => v.id);
      const newSelections = Array.from(
        new Set([...selectedVariantIds, ...filteredIds]),
      );
      onChange(newSelections);
    } else {
      // Remove all currently filtered variants from selections
      const filteredIds = new Set(filteredVariants.map((v) => v.id));
      const newSelections = selectedVariantIds.filter(
        (id) => !filteredIds.has(id),
      );
      onChange(newSelections);
    }
  };

  const handleToggleSingle = (id: number, checked: boolean) => {
    if (checked) {
      onChange([...selectedVariantIds, id]);
    } else {
      onChange(selectedVariantIds.filter((vId) => vId !== id));
    }
  };

  const isAllFilteredSelected =
    filteredVariants.length > 0 &&
    filteredVariants.every((v) => selectedVariantIds.includes(v.id));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label>Tìm kiếm sản phẩm</Label>
          <Input
            placeholder="Tên sách, mã SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Danh mục</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả danh mục</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Nhà xuất bản</Label>
          <Select
            value={selectedPublisher}
            onValueChange={setSelectedPublisher}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Tất cả NXB" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả NXB</SelectItem>
              {publishers.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[50px] text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer align-middle"
                    checked={isAllFilteredSelected}
                    onChange={(e) => handleToggleSelectAll(e.target.checked)}
                  />
                </TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Tên sách (Phiên bản)</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Nhà xuất bản</TableHead>
                <TableHead className="text-right">Giá bán</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : filteredVariants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Không tìm thấy sản phẩm nào.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVariants.map((variant) => (
                  <TableRow
                    key={variant.id}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <TableCell
                      className="text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer align-middle"
                        checked={selectedVariantIds.includes(variant.id)}
                        onChange={(e) =>
                          handleToggleSingle(variant.id, e.target.checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {variant.sku}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{variant.bookTitle}</span>
                      {variant.format && (
                        <span className="text-muted-foreground ml-1">
                          - {variant.format}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{variant.categoryName}</TableCell>
                    <TableCell>{variant.publisher}</TableCell>
                    <TableCell className="text-right font-medium">
                      {Number(variant.sellingPrice).toLocaleString()}đ
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="bg-slate-50 p-2 text-sm text-muted-foreground border-t flex justify-between">
          <span>Đang hiển thị {filteredVariants.length} kết quả</span>
          <span>
            Đã chọn{" "}
            <strong className="text-slate-900">
              {selectedVariantIds.length}
            </strong>{" "}
            sản phẩm
          </span>
        </div>
      </div>
    </div>
  );
}
