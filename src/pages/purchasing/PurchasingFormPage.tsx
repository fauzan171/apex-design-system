import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  Loader2,
  Save,
  Trash2,
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
import { purchasingService } from "@/data/mockPurchasingData";
import type { PurchaseRequest, PRItem } from "@/types/purchasing";
import { cn } from "@/lib/utils";

export function PurchasingFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [pr, setPR] = useState<PurchaseRequest | null>(null);

  // Form state
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split("T")[0]);
  const [requiredDate, setRequiredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PRItem[]>([]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNew && id) {
      loadPR();
    }
  }, [id]);

  const loadPR = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await purchasingService.getPRById(id);
      if (data) {
        setPR(data);
        setRequestDate(data.requestDate);
        setRequiredDate(data.requiredDate);
        setNotes(data.notes || "");
        setItems(data.items);
      }
    } catch (error) {
      console.error("Failed to load PR:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!requestDate) {
      newErrors.requestDate = "Request date is required";
    }

    if (!requiredDate) {
      newErrors.requiredDate = "Required date is required";
    }

    if (items.length === 0) {
      newErrors.items = "At least one item is required";
    }

    items.forEach((item, index) => {
      if (item.quantity <= 0) {
        newErrors[`item-${index}`] = "Quantity must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (isNew) {
        const newPR = await purchasingService.createPR({
          requestDate,
          requiredDate,
          notes,
          items: items.map((item) => ({
            materialId: item.materialId,
            materialCode: item.materialCode,
            materialName: item.materialName,
            quantity: item.quantity,
            unit: item.unit,
            notes: item.notes,
          })),
        });
        navigate(`/purchasing/${newPR.id}`);
      } else if (pr) {
        await purchasingService.updatePR(pr.id, {
          requestDate,
          requiredDate,
          notes,
          items: items.map((item) => ({
            id: item.id,
            materialId: item.materialId,
            materialCode: item.materialCode,
            materialName: item.materialName,
            quantity: item.quantity,
            unit: item.unit,
            notes: item.notes,
          })),
        });
        navigate(`/purchasing/${pr.id}`);
      }
    } catch (error) {
      console.error("Failed to save PR:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

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
        <Button variant="ghost" size="icon" onClick={() => navigate("/purchasing")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isNew ? "Create Purchase Request" : `Edit ${pr?.prNumber}`}
          </h1>
          <p className="text-sm text-slate-500">
            {isNew ? "Create a new purchase request" : "Edit purchase request (Draft only)"}
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* PR Details */}
          <Card>
            <CardHeader>
              <CardTitle>PR Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestDate">Request Date *</Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    className={errors.requestDate ? "border-red-500" : ""}
                  />
                  {errors.requestDate && (
                    <p className="text-sm text-red-500">{errors.requestDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requiredDate">Required Date *</Label>
                  <Input
                    id="requiredDate"
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className={errors.requiredDate ? "border-red-500" : ""}
                  />
                  {errors.requiredDate && (
                    <p className="text-sm text-red-500">{errors.requiredDate}</p>
                  )}
                </div>
              </div>
              {!isNew && (
                <div className="space-y-2">
                  <Label>PR Number</Label>
                  <Input value={pr?.prNumber} disabled className="bg-slate-50" />
                </div>
              )}
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
              <CardTitle>Items *</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Package className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="font-medium">No items added</p>
                  <p className="text-sm">Items are typically added from Planning Module</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-center">Quantity *</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.materialCode}</p>
                            <p className="text-xs text-slate-500">{item.materialName}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                            className={cn(
                              "w-24 text-center mx-auto",
                              errors[`item-${index}`] && "border-red-500"
                            )}
                          />
                          {errors[`item-${index}`] && (
                            <p className="text-xs text-red-500 mt-1">{errors[`item-${index}`]}</p>
                          )}
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <Input
                            value={item.notes || ""}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].notes = e.target.value;
                              setItems(newItems);
                            }}
                            placeholder="Notes..."
                            className="w-32"
                          />
                        </TableCell>
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

              <div className="pt-4 space-y-2">
                <Button
                  className="w-full gap-2"
                  onClick={handleSave}
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
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/purchasing")}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Card for New PR */}
          {isNew && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Note</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Purchase Requests are typically created from the Planning Module via Material
                      Requirements. Use this form for standalone PRs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}