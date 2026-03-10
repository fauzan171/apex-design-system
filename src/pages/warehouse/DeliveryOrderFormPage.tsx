import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Package,
  Truck,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { warehouseService } from "@/services/warehouseService";
import type { WDDOFormData, WDDOItemFormData } from "@/types/warehouse";
import { toast } from "sonner";

interface StockItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
}

export function DeliveryOrderFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id) && !location.pathname.includes("/create");

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    doNumber: "",
    doDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [items, setItems] = useState<WDDOItemFormData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available stock for DO
  const [availableStock, setAvailableStock] = useState<StockItem[]>([]);

  useEffect(() => {
    if (isEdit && id) {
      loadDO();
    }
    // Load available finished goods stock
    loadAvailableStock();
  }, [id, isEdit]);

  const loadAvailableStock = async () => {
    try {
      const stock = await warehouseService.getAvailableStockForDO();
      setAvailableStock(stock.map((s) => ({
        id: s.id,
        productId: s.productId,
        productCode: s.product.code,
        productName: s.product.name,
        quantity: s.quantity,
        unit: s.product.baseUnit,
      })));
    } catch (error) {
      console.error("Failed to load stock:", error);
    }
  };

  const loadDO = async () => {
    setLoading(true);
    try {
      const doRecord = await warehouseService.getWarehouseDOById(id!);
      if (doRecord) {
        setFormData({
          doNumber: doRecord.do_number ?? "",
          doDate: doRecord.do_date ?? "",
          notes: "",
        });

        setItems(
          doRecord.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load DO:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (index: number, field: keyof WDDOItemFormData, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const addMoreItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        quantity: 1,
      },
    ]);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.doNumber.trim()) {
      newErrors.doNumber = "DO Number is required";
    }

    if (!formData.doDate) {
      newErrors.doDate = "DO Date is required";
    }

    if (items.length === 0) {
      newErrors.items = "At least one item is required";
    }

    items.forEach((item, index) => {
      if (!item.productId) {
        newErrors[`item_${index}_product`] = "Product is required";
      }
      if (!item.productId && item.quantity <= 0) {
        newErrors[`item_${index}_qty`] = "Quantity must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setSaving(true);
    try {
      const submitData: WDDOFormData = {
        do_number: formData.doNumber,
        do_date: formData.doDate,
        items: items
          .filter((item) => item.productId)
          .map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
      };

      if (isEdit && id) {
        await warehouseService.updateWarehouseDO(id, {
          do_date: formData.doDate,
        });
        toast.success("Delivery Order updated successfully");
      } else {
        await warehouseService.createWarehouseDO(submitData);
        toast.success("Delivery Order created successfully");
      }

      navigate("/warehouse");
    } catch (error) {
      console.error("Failed to save DO:", error);
      toast.error("Failed to save Delivery Order");
    } finally {
      setSaving(false);
    }
  };

  const formatQuantity = (qty: number, unit: string) => {
    return `${qty.toLocaleString()} ${unit}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/warehouse")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Edit Delivery Order" : "Create Delivery Order"}
          </h1>
          <p className="text-sm text-slate-500">
            {isEdit
              ? "Update delivery order details and items"
              : "Create delivery order for outbound shipment"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DO Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Delivery Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doNumber">
                  DO Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="doNumber"
                  value={formData.doNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, doNumber: e.target.value });
                    setErrors((prev) => ({ ...prev, doNumber: "" }));
                  }}
                  disabled={isEdit}
                  placeholder="DO-WH-2024-XXX"
                />
                {errors.doNumber && (
                  <p className="text-sm text-red-500">{errors.doNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="doDate">
                  DO Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="doDate"
                  type="date"
                  value={formData.doDate}
                  onChange={(e) => {
                    setFormData({ ...formData, doDate: e.target.value });
                    setErrors((prev) => ({ ...prev, doDate: "" }));
                  }}
                />
                {errors.doDate && (
                  <p className="text-sm text-red-500">{errors.doDate}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Delivery Items
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMoreItem}
                disabled={isEdit}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <div className="text-sm text-slate-500">
                {items.length} item(s)
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {errors.items && (
              <p className="text-sm text-red-500 mb-4">{errors.items}</p>
            )}

            {items.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No items added yet</p>
                <p className="text-sm text-slate-400">
                  Add items to this delivery order
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => {
                  const stockData = availableStock.find((s) => s.productId === item.productId);
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 border rounded-lg"
                    >
                      <div className="flex flex-col gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeItem(index)}
                          disabled={isEdit}
                        >
                          <span className="sr-only">Remove</span>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Product</Label>
                          <Select
                            value={item.productId}
                            onValueChange={(value) => updateItem(index, "productId", value)}
                            disabled={isEdit}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableStock.map((s) => (
                                <SelectItem key={s.productId} value={s.productId}>
                                  {s.productCode} - {s.productName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors[`item_${index}_product`] && (
                            <p className="text-sm text-red-500">{errors[`item_${index}_product`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min={1}
                            max={stockData?.quantity || 0}
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                updateItem(index, "quantity", value);
                              }
                            }}
                            disabled={isEdit}
                          />
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Available: {formatQuantity(stockData?.quantity || 0, stockData?.unit || "")}
                          </div>
                          {errors[`item_${index}_qty`] && (
                            <p className="text-sm text-red-500">{errors[`item_${index}_qty`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Badge variant="outline" className="w-full justify-center">
                            Draft
                          </Badge>
                          <div className="text-xs text-slate-500">
                            {stockData?.unit || "PC"}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => removeItem(index)}
                        disabled={isEdit}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Total Items</p>
                  <p className="text-2xl font-bold text-slate-900">{items.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Total Quantity</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Est. Value</p>
                  <p className="text-2xl font-bold text-slate-900">
                    Rp {((items.reduce((sum, item) => sum + item.quantity, 0) * 10000).toLocaleString())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/warehouse")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? "Update Delivery Order" : "Create Delivery Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Simple Select components for standalone usage
function Select({
  children,
  value,
  onValueChange,
  disabled,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
    >
      {children}
    </select>
  );
}

function SelectTrigger({ children }: { children: React.ReactNode }) {
  return <div className="flex-1">{children}</div>;
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span className="text-slate-900">{placeholder}</span>;
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute z-50 top-full mt-1 w-full rounded-md bg-white shadow-md border border-slate-200 overflow-hidden">
      {children}
    </div>
  );
}

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <option value={value} className="py-2 px-3 text-sm hover:bg-slate-100 cursor-pointer">
      {children}
    </option>
  );
}
