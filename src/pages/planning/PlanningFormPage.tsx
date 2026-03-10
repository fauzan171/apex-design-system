import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { planningService } from "@/services/planningService";
import { productService, bomService } from "@/services/masterDataService";
import { warehouseService } from "@/services/warehouseService";
import type { Product, BoMItem } from "@/types/masterData";
import { cn } from "@/lib/utils";

interface PlanItemWithMR {
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  mrItems: {
    materialId: string;
    materialCode: string;
    materialName: string;
    requiredQty: number;
    availableQty: number;
    shortageQty: number;
    unit: string;
    priorityWeight: number;
  }[];
}

export function PlanningFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Data from API
  const [products, setProducts] = useState<Product[]>([]);
  const [stockLevels, setStockLevels] = useState<Record<string, number>>({});
  const [bomCache, setBomCache] = useState<Record<string, BoMItem[]>>({});

  // Form State
  const [hoOrderReference, setHoOrderReference] = useState("");
  const [planDate, setPlanDate] = useState("");
  const [targetCompletionDate, setTargetCompletionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [planItems, setPlanItems] = useState<PlanItemWithMR[]>([]);

  // Add Product Dialog State
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [productsData, stockData] = await Promise.all([
        productService.getProducts({ type: "FG" }),
        warehouseService.getStocks(),
      ]);
      setProducts(productsData);
      // Convert stock array to record
      const stockRecord: Record<string, number> = {};
      stockData.forEach((s: { productId: string; quantity: number }) => {
        stockRecord[s.productId] = s.quantity;
      });
      setStockLevels(stockRecord);
    } catch (error) {
      console.error("Failed to load initial data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  // Get BoM for a product
  const getBoMForProduct = async (productId: string): Promise<BoMItem[]> => {
    if (bomCache[productId]) {
      return bomCache[productId];
    }
    try {
      const boMs = await bomService.getBoMs({ productId, status: "active" });
      if (boMs.length > 0 && boMs[0].components) {
        const components = boMs[0].components;
        setBomCache((prev) => ({ ...prev, [productId]: components }));
        return components;
      }
    } catch (error) {
      console.error("Failed to load BoM:", error);
    }
    return [];
  };

  // Get finished goods only
  const finishedGoods = products.filter((p: Product) => p.type === "FG");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!hoOrderReference.trim()) {
      newErrors.hoOrderReference = "HO Order Reference is required";
    }
    if (!planDate) {
      newErrors.planDate = "Plan Date is required";
    }
    if (!targetCompletionDate) {
      newErrors.targetCompletionDate = "Target Completion Date is required";
    }
    if (planDate && targetCompletionDate && new Date(targetCompletionDate) < new Date(planDate)) {
      newErrors.targetCompletionDate = "Target date must be after plan date";
    }
    if (planItems.length === 0) {
      newErrors.items = "At least one product is required";
    }

    // Validate priority weights for each item
    planItems.forEach((item, index) => {
      if (item.mrItems.length > 0) {
        const totalWeight = item.mrItems.reduce((sum, m) => sum + m.priorityWeight, 0);
        if (Math.abs(totalWeight - 100) > 0.01) {
          newErrors[`item-${index}`] = `Priority weights must total 100% (currently ${totalWeight}%)`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = async () => {
    if (!selectedProductId || selectedQuantity <= 0) return;

    const product = products.find((p: Product) => p.id === selectedProductId);
    if (!product) return;

    // Check if product already added
    if (planItems.some((item) => item.productId === selectedProductId)) {
      setErrors({ ...errors, product: "Product already added" });
      return;
    }

    // Generate MR items from BoM
    const bomMaterials = await getBoMForProduct(selectedProductId);
    const defaultWeights = [50, 25, 15, 7, 3]; // Default weights

    const mrItems = bomMaterials.map((material: BoMItem, idx: number) => {
      const requiredQty = (material.quantity ?? 0) * selectedQuantity;
      const materialId = material.productId ?? "";
      const availableQty = stockLevels[materialId] || 0;
      const shortageQty = Math.max(0, requiredQty - availableQty);

      return {
        materialId,
        materialCode: material.product?.code ?? "",
        materialName: material.product?.name ?? "",
        requiredQty,
        availableQty,
        shortageQty,
        unit: material.unit ?? "",
        priorityWeight: defaultWeights[idx] || 1,
      };
    });

    const newItem: PlanItemWithMR = {
      productId: selectedProductId,
      productCode: product.code,
      productName: product.name,
      quantity: selectedQuantity,
      unit: product.unitOfMeasure ?? "PCS",
      mrItems,
    };

    setPlanItems([...planItems, newItem]);
    setSelectedProductId("");
    setSelectedQuantity(1);
    setShowAddProductDialog(false);
    setErrors({ ...errors, items: "", product: "" });
  };

  const handleRemoveProduct = (index: number) => {
    const newItems = planItems.filter((_, i) => i !== index);
    setPlanItems(newItems);
  };

  const handlePriorityWeightChange = (itemIndex: number, materialId: string, value: number) => {
    const newItems = [...planItems];
    const item = newItems[itemIndex];
    const mrItem = item.mrItems.find((m) => m.materialId === materialId);
    if (mrItem) {
      mrItem.priorityWeight = Math.max(0, Math.min(100, value));
    }
    setPlanItems(newItems);
  };

  const handleQuantityChange = async (index: number, quantity: number) => {
    if (quantity <= 0) return;

    const newItems = [...planItems];
    const item = newItems[index];

    // Recalculate MR items
    const bomMaterials = await getBoMForProduct(item.productId);
    item.quantity = quantity;

    item.mrItems = bomMaterials.map((material: BoMItem) => {
      const materialId = material.productId ?? "";
      const existingMrItem = item.mrItems.find((m) => m.materialId === materialId);
      const requiredQty = (material.quantity ?? 0) * quantity;
      const availableQty = stockLevels[materialId] || 0;
      const shortageQty = Math.max(0, requiredQty - availableQty);

      return {
        ...existingMrItem!,
        requiredQty,
        availableQty,
        shortageQty,
      };
    });

    setPlanItems(newItems);
  };

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create plan
      const newPlan = await planningService.createPlan({
        ho_order_reference: hoOrderReference,
        plan_date: planDate,
        target_completion_date: targetCompletionDate,
        notes,
      });

      // Add items to plan
      for (const item of planItems) {
        await planningService.addPlanItem(newPlan.id, {
          product_id: item.productId,
          quantity: item.quantity,
          mrItems: item.mrItems.map((m) => ({
            materialId: m.materialId,
            priorityWeight: m.priorityWeight,
          })),
        });
      }

      navigate(`/planning/${newPlan.id}`);
    } catch (error) {
      console.error("Failed to create plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPriorityWeight = (item: PlanItemWithMR): number => {
    return item.mrItems.reduce((sum, m) => sum + m.priorityWeight, 0);
  };

  if (initialLoading) {
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/planning")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Production Plan</h1>
          <p className="text-sm text-slate-500 mt-1">
            Define production plan and material requirements
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Plan Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plan Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* HO Order Reference */}
              <div className="space-y-2">
                <Label htmlFor="hoOrderRef">
                  HO Order Reference <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hoOrderRef"
                  placeholder="e.g., HO-ORD-2024-0001"
                  value={hoOrderReference}
                  onChange={(e) => setHoOrderReference(e.target.value)}
                  className={errors.hoOrderReference ? "border-red-500" : ""}
                />
                {errors.hoOrderReference && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.hoOrderReference}
                  </p>
                )}
              </div>

              {/* Plan Date */}
              <div className="space-y-2">
                <Label htmlFor="planDate">
                  Plan Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="planDate"
                  type="date"
                  value={planDate}
                  onChange={(e) => setPlanDate(e.target.value)}
                  className={errors.planDate ? "border-red-500" : ""}
                />
                {errors.planDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.planDate}
                  </p>
                )}
              </div>

              {/* Target Completion Date */}
              <div className="space-y-2">
                <Label htmlFor="targetDate">
                  Target Completion Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={targetCompletionDate}
                  onChange={(e) => setTargetCompletionDate(e.target.value)}
                  className={errors.targetCompletionDate ? "border-red-500" : ""}
                />
                {errors.targetCompletionDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.targetCompletionDate}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Products</span>
                <span className="font-medium">{planItems.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Materials</span>
                <span className="font-medium">
                  {planItems.reduce((sum, item) => sum + item.mrItems.length, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Items with Shortage</span>
                <span className="font-medium text-amber-600">
                  {planItems.reduce(
                    (sum, item) =>
                      sum + item.mrItems.filter((m) => m.shortageQty > 0).length,
                    0
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Products */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Products</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowAddProductDialog(true)}
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              {errors.items && (
                <p className="text-sm text-red-500 flex items-center gap-1 mb-4">
                  <AlertCircle className="h-3 w-3" />
                  {errors.items}
                </p>
              )}

              {planItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Package className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="font-medium">No products added</p>
                  <p className="text-sm">Click "Add Product" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {planItems.map((item, index) => {
                    const totalWeight = getTotalPriorityWeight(item);
                    const isValidWeight = Math.abs(totalWeight - 100) < 0.01;

                    return (
                      <div
                        key={item.productId}
                        className="border rounded-lg overflow-hidden"
                      >
                        {/* Product Header */}
                        <div
                          className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer"
                          onClick={() => toggleItem(index)}
                        >
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              {expandedItems.has(index) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.productCode}</span>
                                <span className="text-slate-500">-</span>
                                <span>{item.productName}</span>
                              </div>
                              <div className="text-sm text-slate-500 mt-1">
                                Qty: {item.quantity} {item.unit} | {item.mrItems.length} materials
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
                              isValidWeight ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            )}>
                              <span>Priority: {totalWeight.toFixed(0)}%</span>
                              {isValidWeight ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveProduct(index);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedItems.has(index) && (
                          <div className="p-4 border-t">
                            {/* Quantity Input */}
                            <div className="flex items-center gap-4 mb-4">
                              <Label className="text-sm">Quantity:</Label>
                              <Input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(index, parseInt(e.target.value) || 1)
                                }
                                className="w-24"
                              />
                              <span className="text-sm text-slate-500">{item.unit}</span>
                            </div>

                            {/* MR Items Table */}
                            {item.mrItems.length > 0 ? (
                              <div className="border rounded-lg overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-slate-50">
                                      <TableHead>Material</TableHead>
                                      <TableHead className="text-right">Required</TableHead>
                                      <TableHead className="text-right">Available</TableHead>
                                      <TableHead className="text-right">Shortage</TableHead>
                                      <TableHead className="text-center w-32">Priority %</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {item.mrItems.map((mrItem) => (
                                      <TableRow key={mrItem.materialId}>
                                        <TableCell>
                                          <div>
                                            <p className="font-medium">{mrItem.materialCode}</p>
                                            <p className="text-xs text-slate-500">
                                              {mrItem.materialName}
                                            </p>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {mrItem.requiredQty.toLocaleString()} {mrItem.unit}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {mrItem.availableQty.toLocaleString()} {mrItem.unit}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {mrItem.shortageQty > 0 ? (
                                            <span className="text-red-600 font-medium">
                                              -{mrItem.shortageQty.toLocaleString()} {mrItem.unit}
                                            </span>
                                          ) : (
                                            <span className="text-green-600">-</span>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <Input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={mrItem.priorityWeight}
                                            onChange={(e) =>
                                              handlePriorityWeightChange(
                                                index,
                                                mrItem.materialId,
                                                parseInt(e.target.value) || 0
                                              )
                                            }
                                            className={cn(
                                              "w-24 text-center",
                                              mrItem.priorityWeight ===
                                                Math.max(...item.mrItems.map((m) => m.priorityWeight)) &&
                                                "border-amber-400 bg-amber-50"
                                            )}
                                          />
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500 text-center py-4">
                                No materials found for this product (BoM not configured)
                              </p>
                            )}

                            {/* Priority Weight Validation */}
                            {!isValidWeight && item.mrItems.length > 0 && (
                              <p className="text-sm text-amber-600 flex items-center gap-1 mt-2">
                                <AlertCircle className="h-3 w-3" />
                                Total priority must equal 100% (currently {totalWeight.toFixed(1)}%)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => navigate("/planning")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Plan
        </Button>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Select a product and quantity to add to the production plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {(finishedGoods.length > 0 ? finishedGoods : products).map((product: Product) => (
                    <SelectItem
                      key={product.id}
                      value={product.id}
                      disabled={planItems.some((item) => item.productId === product.id)}
                    >
                      {product.code} - {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product && (
                <p className="text-sm text-red-500">{errors.product}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProductDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddProduct}
              disabled={!selectedProductId || selectedQuantity <= 0}
            >
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}