import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Package,
  DollarSign,
  Warehouse,
  Tag,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { productService } from "@/services/masterDataService";
import type {
  ProductCategory,
  UnitOfMeasure,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/masterData";
import {
  ProductCategory as ProductCategoryEnum,
  UnitOfMeasure as UnitOfMeasureEnum,
  productCategoryLabels,
  unitOfMeasureLabels,
} from "@/types/masterData";

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    category: "" as ProductCategory | "",
    unitOfMeasure: "" as UnitOfMeasure | "",
    basePrice: 0,
    sellingPrice: 0,
    costPrice: 0,
    minStock: 0,
    maxStock: 0,
    reorderPoint: 0,
    weight: 0,
    weightUnit: "kg" as "kg" | "g",
    length: 0,
    width: 0,
    height: 0,
    dimensionUnit: "cm" as "cm" | "mm" | "m",
    shelfLife: 0,
    storageCondition: "",
    barcode: "",
    isPurchasable: false,
    isSellable: true,
    taxRate: 11,
  });

  useEffect(() => {
    if (isEdit && id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    try {
      const product = await productService.getProductById(id);
      if (product) {
        setFormData({
          code: product.code,
          name: product.name,
          description: product.description,
          category: product.category,
          unitOfMeasure: product.unitOfMeasure,
          basePrice: product.basePrice,
          sellingPrice: product.sellingPrice,
          costPrice: product.costPrice,
          minStock: product.minStock,
          maxStock: product.maxStock,
          reorderPoint: product.reorderPoint,
          weight: product.weight || 0,
          weightUnit: product.weightUnit || "kg",
          length: product.dimensions?.length || 0,
          width: product.dimensions?.width || 0,
          height: product.dimensions?.height || 0,
          dimensionUnit: product.dimensionUnit || "cm",
          shelfLife: product.shelfLife || 0,
          storageCondition: product.storageCondition || "",
          barcode: product.barcode || "",
          isPurchasable: product.isPurchasable,
          isSellable: product.isSellable,
          taxRate: product.taxRate,
        });
      } else {
        navigate("/products");
      }
    } catch (error) {
      console.error("Failed to load product:", error);
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.code.trim()) {
      setError("Product code is required");
      return false;
    }
    if (!formData.name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!formData.category) {
      setError("Category is required");
      return false;
    }
    if (!formData.unitOfMeasure) {
      setError("Unit of measure is required");
      return false;
    }
    if (formData.costPrice < 0) {
      setError("Cost price cannot be negative");
      return false;
    }
    if (formData.sellingPrice < 0) {
      setError("Selling price cannot be negative");
      return false;
    }
    if (formData.minStock < 0 || formData.maxStock < 0) {
      setError("Stock levels cannot be negative");
      return false;
    }
    if (formData.minStock > formData.maxStock) {
      setError("Minimum stock cannot be greater than maximum stock");
      return false;
    }
    if (formData.reorderPoint > formData.maxStock) {
      setError("Reorder point cannot be greater than maximum stock");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError("");

    try {
      const dimensions =
        formData.length > 0 || formData.width > 0 || formData.height > 0
          ? {
              length: formData.length,
              width: formData.width,
              height: formData.height,
            }
          : undefined;

      if (isEdit) {
        const updateData: UpdateProductRequest = {
          name: formData.name,
          description: formData.description,
          category: formData.category as ProductCategory,
          unitOfMeasure: formData.unitOfMeasure as UnitOfMeasure,
          basePrice: formData.basePrice,
          sellingPrice: formData.sellingPrice,
          costPrice: formData.costPrice,
          minStock: formData.minStock,
          maxStock: formData.maxStock,
          reorderPoint: formData.reorderPoint,
          weight: formData.weight > 0 ? formData.weight : undefined,
          weightUnit: formData.weight > 0 ? formData.weightUnit : undefined,
          dimensions,
          dimensionUnit: dimensions ? formData.dimensionUnit : undefined,
          shelfLife: formData.shelfLife > 0 ? formData.shelfLife : undefined,
          storageCondition: formData.storageCondition || undefined,
          barcode: formData.barcode || undefined,
          isPurchasable: formData.isPurchasable,
          isSellable: formData.isSellable,
          taxRate: formData.taxRate,
        };
        await productService.updateProduct(id!, updateData);
      } else {
        const createData: CreateProductRequest = {
          code: formData.code,
          name: formData.name,
          description: formData.description,
          category: formData.category as ProductCategory,
          unitOfMeasure: formData.unitOfMeasure as UnitOfMeasure,
          basePrice: formData.basePrice,
          sellingPrice: formData.sellingPrice,
          costPrice: formData.costPrice,
          minStock: formData.minStock,
          maxStock: formData.maxStock,
          reorderPoint: formData.reorderPoint,
          weight: formData.weight > 0 ? formData.weight : undefined,
          weightUnit: formData.weight > 0 ? formData.weightUnit : undefined,
          dimensions,
          dimensionUnit: dimensions ? formData.dimensionUnit : undefined,
          shelfLife: formData.shelfLife > 0 ? formData.shelfLife : undefined,
          storageCondition: formData.storageCondition || undefined,
          barcode: formData.barcode || undefined,
          isPurchasable: formData.isPurchasable,
          isSellable: formData.isSellable,
          taxRate: formData.taxRate,
        };
        await productService.createProduct(createData);
      }
      navigate("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Edit Product" : "Create Product"}
          </h1>
          <p className="text-sm text-slate-500">
            {isEdit
              ? "Update product information"
              : "Add a new product to inventory"}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-slate-500" />
            <CardTitle>Basic Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Product Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="e.g., FG-001"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                disabled={isEdit}
              />
              {isEdit && (
                <p className="text-xs text-slate-500">Product code cannot be changed</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as ProductCategory })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ProductCategoryEnum).map(([_key, value]) => (
                    <SelectItem key={value} value={value}>
                      {productCategoryLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Unit of Measure <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.unitOfMeasure}
                onValueChange={(value) =>
                  setFormData({ ...formData, unitOfMeasure: value as UnitOfMeasure })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode / SKU</Label>
              <Input
                id="barcode"
                placeholder="Enter barcode"
                value={formData.barcode}
                onChange={(e) =>
                  setFormData({ ...formData, barcode: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min={0}
                max={100}
                value={formData.taxRate}
                onChange={(e) =>
                  setFormData({ ...formData, taxRate: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-slate-500" />
            <CardTitle>Pricing</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price</Label>
              <Input
                id="costPrice"
                type="number"
                min={0}
                placeholder="0"
                value={formData.costPrice || ""}
                onChange={(e) =>
                  setFormData({ ...formData, costPrice: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price</Label>
              <Input
                id="basePrice"
                type="number"
                min={0}
                placeholder="0"
                value={formData.basePrice || ""}
                onChange={(e) =>
                  setFormData({ ...formData, basePrice: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price</Label>
              <Input
                id="sellingPrice"
                type="number"
                min={0}
                placeholder="0"
                value={formData.sellingPrice || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sellingPrice: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPurchasable"
                checked={formData.isPurchasable}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPurchasable: checked as boolean })
                }
              />
              <Label htmlFor="isPurchasable" className="cursor-pointer">
                Can be purchased
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isSellable"
                checked={formData.isSellable}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isSellable: checked as boolean })
                }
              />
              <Label htmlFor="isSellable" className="cursor-pointer">
                Can be sold
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-slate-500" />
            <CardTitle>Inventory Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minStock">Minimum Stock</Label>
              <Input
                id="minStock"
                type="number"
                min={0}
                placeholder="0"
                value={formData.minStock || ""}
                onChange={(e) =>
                  setFormData({ ...formData, minStock: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock">Maximum Stock</Label>
              <Input
                id="maxStock"
                type="number"
                min={0}
                placeholder="0"
                value={formData.maxStock || ""}
                onChange={(e) =>
                  setFormData({ ...formData, maxStock: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderPoint">Reorder Point</Label>
              <Input
                id="reorderPoint"
                type="number"
                min={0}
                placeholder="0"
                value={formData.reorderPoint || ""}
                onChange={(e) =>
                  setFormData({ ...formData, reorderPoint: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storageCondition">Storage Conditions</Label>
            <Input
              id="storageCondition"
              placeholder="e.g., Store in cool dry place"
              value={formData.storageCondition}
              onChange={(e) =>
                setFormData({ ...formData, storageCondition: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shelfLife">Shelf Life (days)</Label>
            <Input
              id="shelfLife"
              type="number"
              min={0}
              placeholder="0"
              value={formData.shelfLife || ""}
              onChange={(e) =>
                setFormData({ ...formData, shelfLife: Number(e.target.value) })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Physical Attributes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-slate-500" />
            <CardTitle>Physical Attributes</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0"
                  value={formData.weight || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: Number(e.target.value) })
                  }
                  className="flex-1"
                />
                <Select
                  value={formData.weightUnit}
                  onValueChange={(value) =>
                    setFormData({ ...formData, weightUnit: value as "kg" | "g" })
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dimensions</Label>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label className="text-xs text-slate-500">Length</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="0"
                  value={formData.length || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, length: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Width</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="0"
                  value={formData.width || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, width: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Height</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="0"
                  value={formData.height || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, height: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Unit</Label>
                <Select
                  value={formData.dimensionUnit}
                  onValueChange={(value) =>
                    setFormData({ ...formData, dimensionUnit: value as "cm" | "mm" | "m" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm">mm</SelectItem>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="m">m</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/products")}>
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
              {isEdit ? "Save Changes" : "Create Product"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
