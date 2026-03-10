import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Calculator,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { productService, bomService } from "@/services/masterDataService";
import type {
  Product,
  UnitOfMeasure,
  CreateBoMRequest,
} from "@/types/masterData";
import { UnitOfMeasure as UnitOfMeasureEnum, unitOfMeasureLabels } from "@/types/masterData";
import { formatCurrency } from "@/lib/utils";

interface BoMComponentForm {
  id: string;
  productId: string;
  quantity: number;
  wastagePercent: number;
  notes: string;
  sortOrder: number;
}

export function BoMFormPage() {
  const { productId, id } = useParams<{ productId: string; id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [product, setProduct] = useState<Product | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    version: "",
    quantity: 1,
    unitOfMeasure: "PCS" as UnitOfMeasure,
    laborCost: 0,
    overheadCost: 0,
    notes: "",
    effectiveDate: new Date().toISOString().split("T")[0],
  });

  const [components, setComponents] = useState<BoMComponentForm[]>([]);

  useEffect(() => {
    loadData();
  }, [productId, id]);

  const loadData = async () => {
    try {
      const [productData, productsData] = await Promise.all([
        productService.getProductById(productId!),
        productService.getProducts({ status: "active" }),
      ]);

      if (productData) {
        setProduct(productData);
        // Filter out current product from available components
        setAvailableProducts(productsData.filter((p) => p.id !== productId));

        if (isEdit && id) {
          const bom = await bomService.getBoMById(id);
          if (bom) {
            setFormData({
              version: String(bom.version ?? ""),
              quantity: bom.quantity ?? 1,
              unitOfMeasure: (bom.unitOfMeasure ?? "PCS") as UnitOfMeasure,
              laborCost: bom.laborCost ?? 0,
              overheadCost: bom.overheadCost ?? 0,
              notes: bom.notes ?? "",
              effectiveDate: bom.effectiveDate ? bom.effectiveDate.split("T")[0] : new Date().toISOString().split("T")[0],
            });
            setComponents(
              (bom.components ?? bom.items ?? []).map((c) => ({
                id: c.id ?? `temp_${Date.now()}`,
                productId: c.productId ?? c.materialId ?? "",
                quantity: c.quantity ?? c.quantityRequired ?? 0,
                wastagePercent: c.wastagePercent ?? 0,
                notes: c.notes ?? "",
                sortOrder: c.sortOrder ?? 0,
              }))
            );
          } else {
            navigate(`/products/${productId}/bom`);
          }
        }
      } else {
        navigate("/products");
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addComponent = () => {
    setComponents([
      ...components,
      {
        id: `temp_${Date.now()}`,
        productId: "",
        quantity: 1,
        wastagePercent: 0,
        notes: "",
        sortOrder: components.length + 1,
      },
    ]);
  };

  const updateComponent = (index: number, updates: Partial<BoMComponentForm>) => {
    const updated = [...components];
    updated[index] = { ...updated[index], ...updates };
    setComponents(updated);
  };

  const removeComponent = (index: number) => {
    const updated = components.filter((_, i) => i !== index);
    // Reorder sortOrder
    updated.forEach((c, i) => (c.sortOrder = i + 1));
    setComponents(updated);
  };

  const moveComponent = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === components.length - 1) return;

    const updated = [...components];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    updated.forEach((c, i) => (c.sortOrder = i + 1));
    setComponents(updated);
  };

  const calculateCosts = () => {
    let materialCost = 0;

    components.forEach((comp) => {
      const product = availableProducts.find((p) => p.id === comp.productId);
      if (product && product.costPrice !== undefined) {
        const quantityWithWastage = comp.quantity * (1 + comp.wastagePercent / 100);
        materialCost += product.costPrice * quantityWithWastage;
      }
    });

    const totalCost = materialCost + formData.laborCost + formData.overheadCost;

    return { materialCost, totalCost };
  };

  const validateForm = (): boolean => {
    if (!formData.version.trim()) {
      setError("Version is required");
      return false;
    }
    if (formData.quantity <= 0) {
      setError("Output quantity must be greater than 0");
      return false;
    }
    if (components.length === 0) {
      setError("At least one component is required");
      return false;
    }
    for (const comp of components) {
      if (!comp.productId) {
        setError("All components must have a product selected");
        return false;
      }
      if (comp.quantity <= 0) {
        setError("Component quantities must be greater than 0");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError("");

    try {
      const componentData = components.map((c) => ({
        productId: c.productId,
        quantity: c.quantity,
        wastagePercent: c.wastagePercent,
        notes: c.notes,
        sortOrder: c.sortOrder,
      }));

      if (isEdit) {
        await bomService.updateBoM(id!, {
          laborCost: formData.laborCost,
          overheadCost: formData.overheadCost,
          notes: formData.notes,
        });
      } else {
        const createData: CreateBoMRequest = {
          status: "draft",
          items: componentData.map((c) => ({
            materialId: c.productId,
            quantityRequired: c.quantity,
            unit: formData.unitOfMeasure,
          })),
        };
        await bomService.createBoM(productId!, createData);
      }
      navigate(`/products/${productId}/bom`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save BoM");
    } finally {
      setSaving(false);
    }
  };

  const { materialCost, totalCost } = calculateCosts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/products/${productId}/bom`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Edit BoM" : "Create BoM"}
          </h1>
          <p className="text-sm text-slate-500">
            {product?.code} - {product?.name}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* BoM Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-500" />
            <CardTitle>BoM Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">
                Version <span className="text-red-500">*</span>
              </Label>
              <Input
                id="version"
                placeholder="e.g., V1.0"
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value.toUpperCase() })
                }
                disabled={isEdit}
              />
              {isEdit && (
                <p className="text-xs text-slate-500">Version cannot be changed</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Output Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select
                value={formData.unitOfMeasure}
                onValueChange={(value) =>
                  setFormData({ ...formData, unitOfMeasure: value as UnitOfMeasure })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(UnitOfMeasureEnum).map(([_key, value]) => (
                    <SelectItem key={value} value={value}>
                      {unitOfMeasureLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="effectiveDate">Effective Date</Label>
            <Input
              id="effectiveDate"
              type="date"
              value={formData.effectiveDate}
              onChange={(e) =>
                setFormData({ ...formData, effectiveDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this BoM"
              rows={2}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Components */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-slate-500" />
            Components
          </CardTitle>
          <Button onClick={addComponent} variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Component
          </Button>
        </CardHeader>
        <CardContent>
          {components.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No components added yet</p>
              <Button onClick={addComponent} variant="outline" className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Add First Component
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="w-32">Quantity</TableHead>
                  <TableHead className="w-32">Wastage %</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {components.map((comp, index) => {
                  const product = availableProducts.find((p) => p.id === comp.productId);
                  const quantityWithWastage = comp.quantity * (1 + comp.wastagePercent / 100);
                  const cost = product && product.costPrice !== undefined ? product.costPrice * quantityWithWastage : 0;

                  return (
                    <TableRow key={comp.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <button
                            onClick={() => moveComponent(index, "up")}
                            disabled={index === 0}
                            className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveComponent(index, "down")}
                            disabled={index === components.length - 1}
                            className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={comp.productId}
                          onValueChange={(value) =>
                            updateComponent(index, { productId: value })
                          }
                        >
                          <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableProducts.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.code} - {p.name} ({formatCurrency(p.costPrice ?? 0)}/{p.unitOfMeasure ?? "unit"})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0.01}
                          step={0.01}
                          value={comp.quantity}
                          onChange={(e) =>
                            updateComponent(index, { quantity: Number(e.target.value) })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={comp.wastagePercent}
                          onChange={(e) =>
                            updateComponent(index, { wastagePercent: Number(e.target.value) })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Notes"
                          value={comp.notes}
                          onChange={(e) =>
                            updateComponent(index, { notes: e.target.value })
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(cost)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeComponent(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-slate-500" />
            Cost Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="laborCost">Labor Cost</Label>
              <Input
                id="laborCost"
                type="number"
                min={0}
                value={formData.laborCost}
                onChange={(e) =>
                  setFormData({ ...formData, laborCost: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overheadCost">Overhead Cost</Label>
              <Input
                id="overheadCost"
                type="number"
                min={0}
                value={formData.overheadCost}
                onChange={(e) =>
                  setFormData({ ...formData, overheadCost: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-500">Total Material Cost</Label>
              <div className="h-10 flex items-center font-medium">
                {formatCurrency(materialCost)}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Cost per {formData.unitOfMeasure}:</span>
              <span className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalCost / (formData.quantity || 1))}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-slate-600">Total Production Cost:</span>
              <span className="text-xl font-semibold text-slate-900">
                {formatCurrency(totalCost)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(`/products/${productId}/bom`)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEdit ? "Save Changes" : "Create BoM"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}