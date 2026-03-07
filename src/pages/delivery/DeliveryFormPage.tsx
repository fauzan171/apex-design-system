import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Package,
  AlertTriangle,
  Loader2,
  Save,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deliveryService } from "@/data/mockDeliveryData";
import type { FinishedGoodStock } from "@/types/delivery";
import { cn } from "@/lib/utils";

interface DOItemForm {
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  availableStock: number;
  unit: string;
}

export function DeliveryFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [finishedGoods, setFinishedGoods] = useState<FinishedGoodStock[]>([]);

  // Form state
  const [doDate, setDODate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DOItemForm[]>([]);

  // Dialog state
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState("");

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadFinishedGoods();
  }, []);

  const loadFinishedGoods = async () => {
    setLoading(true);
    try {
      const data = await deliveryService.getFinishedGoodsStock();
      setFinishedGoods(data);
    } catch (error) {
      console.error("Failed to load finished goods:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!doDate) {
      newErrors.doDate = "DO Date is required";
    }

    if (items.length === 0) {
      newErrors.items = "At least one item is required";
    }

    // Check for items with quantity > available stock
    items.forEach((item, index) => {
      if (item.quantity > item.availableStock) {
        newErrors[`item-${index}`] = `Quantity exceeds available stock (${item.availableStock})`;
      }
      if (item.quantity <= 0) {
        newErrors[`item-${index}`] = "Quantity must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    if (!selectedProductId) return;

    const product = finishedGoods.find((p) => p.productId === selectedProductId);
    if (!product) return;

    // Check if item already exists
    const existingIndex = items.findIndex((i) => i.productId === selectedProductId);
    if (existingIndex >= 0) {
      // Update quantity
      const newItems = [...items];
      newItems[existingIndex].quantity += itemQuantity;
      setItems(newItems);
    } else {
      // Add new item
      setItems([
        ...items,
        {
          productId: product.productId,
          productCode: product.productCode,
          productName: product.productName,
          quantity: itemQuantity,
          availableStock: product.availableForDO,
          unit: product.unit,
        },
      ]);
    }

    // Reset dialog
    setSelectedProductId("");
    setItemQuantity(1);
    setShowAddItemDialog(false);
    setQuantityError("");
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  const handleSave = async (release: boolean = false) => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const newDO = await deliveryService.createDO({
        doDate,
        notes,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      if (release) {
        // Update status to Released
        await deliveryService.updateDOStatus(newDO.id, "Released" as any);
      }

      navigate(`/delivery/${newDO.id}`);
    } catch (error) {
      console.error("Failed to create DO:", error);
    } finally {
      setSaving(false);
    }
  };

  const selectedProduct = finishedGoods.find((p) => p.productId === selectedProductId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/delivery")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Delivery Order</h1>
          <p className="text-sm text-slate-500">Create a new DO to ship finished goods to HO</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* DO Details */}
            <Card>
              <CardHeader>
                <CardTitle>DO Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doDate">DO Date *</Label>
                    <Input
                      id="doDate"
                      type="date"
                      value={doDate}
                      onChange={(e) => setDODate(e.target.value)}
                      className={errors.doDate ? "border-red-500" : ""}
                    />
                    {errors.doDate && (
                      <p className="text-sm text-red-500">{errors.doDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>DO Number</Label>
                    <Input value="Auto-generated" disabled className="bg-slate-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Items *</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowAddItemDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <Package className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="font-medium">No items added</p>
                    <p className="text-sm">Click "Add Item" to add finished goods</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Code</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead className="text-center">Available</TableHead>
                        <TableHead className="text-center">Quantity *</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={item.productId}>
                          <TableCell className="font-medium">{item.productCode}</TableCell>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={cn(
                                item.quantity > item.availableStock
                                  ? "text-red-600 font-medium"
                                  : "text-slate-600"
                              )}
                            >
                              {item.availableStock.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min={1}
                              max={item.availableStock}
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(index, parseInt(e.target.value) || 0)
                              }
                              className={cn(
                                "w-24 text-center mx-auto",
                                (errors[`item-${index}`] ||
                                  item.quantity > item.availableStock) &&
                                  "border-red-500"
                              )}
                            />
                            {errors[`item-${index}`] && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors[`item-${index}`]}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {errors.items && (
                  <div className="p-4 text-center text-red-500 text-sm">{errors.items}</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Items</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Quantity</span>
                  <span className="font-medium">
                    {items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} units
                  </span>
                </div>

                {/* Validation warnings */}
                {items.some((item) => item.quantity > item.availableStock) && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Insufficient Stock Warning
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Some items have quantity greater than available stock. Please adjust
                          quantities before saving.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <Button
                    className="w-full gap-2"
                    onClick={() => handleSave(false)}
                    disabled={saving || items.length === 0}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save as Draft
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handleSave(true)}
                    disabled={
                      saving ||
                      items.length === 0 ||
                      items.some((item) => item.quantity > item.availableStock)
                    }
                  >
                    <Send className="h-4 w-4" />
                    Save & Release
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => navigate("/delivery")}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Available Stock */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Available Finished Goods</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {finishedGoods.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    No finished goods available
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {finishedGoods.map((fg) => (
                        <TableRow key={fg.productId}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{fg.productCode}</p>
                              <p className="text-xs text-slate-500">{fg.productName}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">
                              {fg.availableForDO.toLocaleString()} {fg.unit}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Add Item Dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
              Select a finished good and specify the quantity to add to the DO.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {finishedGoods
                    .filter(
                      (fg) =>
                        fg.availableForDO > 0 &&
                        !items.some((i) => i.productId === fg.productId)
                    )
                    .map((fg) => (
                      <SelectItem key={fg.productId} value={fg.productId}>
                        {fg.productCode} - {fg.productName} ({fg.availableForDO} {fg.unit} available)
                      </SelectItem>
                    ))}
                  {finishedGoods.filter(
                    (fg) =>
                      fg.availableForDO > 0 &&
                      !items.some((i) => i.productId === fg.productId)
                  ).length === 0 && (
                    <SelectItem value="_none" disabled>
                      No products available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && (
              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={1}
                    max={selectedProduct.availableForDO}
                    value={itemQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setItemQuantity(val);
                      if (val > selectedProduct.availableForDO) {
                        setQuantityError(
                          `Maximum available: ${selectedProduct.availableForDO}`
                        );
                      } else {
                        setQuantityError("");
                      }
                    }}
                    className={quantityError ? "border-red-500" : ""}
                  />
                  <span className="text-slate-500">{selectedProduct.unit}</span>
                </div>
                {quantityError && (
                  <p className="text-sm text-red-500">{quantityError}</p>
                )}
                <p className="text-sm text-slate-500">
                  Available stock: {selectedProduct.availableForDO.toLocaleString()}{" "}
                  {selectedProduct.unit}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddItemDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddItem}
              disabled={!selectedProductId || itemQuantity <= 0}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}