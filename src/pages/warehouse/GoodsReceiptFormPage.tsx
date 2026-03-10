import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Loader2,
  Package,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { warehouseService } from "@/services/warehouseService";
import { purchasingService } from "@/services/purchasingService";
import type { GRFormData, GRItemFormData } from "@/types/warehouse";
import type { PurchaseRequest as PRType, PRItem } from "@/types/purchasing";
import { GRStatus } from "@/types/warehouse";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PurchaseRequest {
  id: string;
  prNumber: string;
  prDate: string;
  supplierName: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unit: string;
    quantityReceived: number;
  }[];
}

export function GoodsReceiptFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id) && !location.pathname.includes("/create");

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [prLoading, setPrLoading] = useState(false);
  const [showPRDialog, setShowPRDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    prId: "",
    prNumber: "",
    doNumber: "",
    grDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [items, setItems] = useState<GRItemFormData[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available PRs for selection
  const [availablePRs, setAvailablePRs] = useState<PurchaseRequest[]>([]);

  useEffect(() => {
    if (isEdit && id) {
      loadGR();
    }
    // Load available PRs for selection
    loadAvailablePRs();
  }, [id, isEdit]);

  const loadAvailablePRs = async () => {
    setPrLoading(true);
    try {
      const data = await purchasingService.getPRs({
        status: "approved",
      });
      setAvailablePRs(
        data.map((pr: PRType) => ({
          id: pr.id,
          prNumber: pr.prNumber ?? "",
          prDate: pr.requestDate ?? pr.createdAt ?? "",
          supplierName: "Supplier",
          items: (pr.items ?? []).map((item: PRItem) => ({
            id: item.id,
            productId: item.materialId,
            productName: item.material?.name ?? item.materialName ?? "",
            productCode: item.material?.code ?? item.materialCode ?? "",
            quantity: item.quantityRequested ?? 0,
            unit: item.unit,
            quantityReceived: item.quantityReceived ?? 0,
          })),
        }))
      );
    } catch (error) {
      console.error("Failed to load PRs:", error);
    } finally {
      setPrLoading(false);
    }
  };

  const loadGR = async () => {
    setLoading(true);
    try {
      const gr = await warehouseService.getGoodsReceiptById(id!);
      if (gr) {
        if (gr.status !== GRStatus.DRAFT) {
          // Cannot edit non-draft GR
          navigate(`/warehouse/gr/${id}`);
          return;
        }

        setFormData({
          prId: gr.prId ?? "",
          prNumber: gr.purchaseRequest?.prNumber ?? "",
          doNumber: gr.do_number ?? "",
          grDate: gr.gr_date ?? "",
          notes: gr.notes || "",
        });

        setItems(
          gr.items.map((item) => ({
            prItemId: item.prItemId,
            quantityReceived: item.quantityReceived,
            inspectionNotes: item.inspectionNotes || "",
          }))
        );

        // Mark items as selected
        const selected: Record<string, boolean> = {};
        gr.items.forEach((item) => {
          selected[item.prItemId] = true;
        });
        setSelectedMaterials(selected);
      }
    } catch (error) {
      console.error("Failed to load GR:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectPR = (pr: PurchaseRequest) => {
    setFormData({
      prId: pr.id,
      prNumber: pr.prNumber,
      doNumber: `DO-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      grDate: new Date().toISOString().split("T")[0],
      notes: "",
    });

    // Initialize items for selected PR
    const newItems: GRItemFormData[] = pr.items.map((item) => ({
      prItemId: item.id,
      quantityReceived: 0,
      inspectionNotes: "",
    }));

    setItems(newItems);

    // Mark all as selected
    const selected: Record<string, boolean> = {};
    pr.items.forEach((item) => {
      selected[item.id] = true;
    });
    setSelectedMaterials(selected);

    setShowPRDialog(false);
    setErrors((prev) => ({ ...prev, prId: "" }));
  };

  const updateItem = (index: number, field: keyof GRItemFormData, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const toggleItemSelection = (prItemId: string) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [prItemId]: !prev[prItemId],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.prId) {
      newErrors.prId = "Purchase Request is required";
    }

    if (!formData.doNumber.trim()) {
      newErrors.doNumber = "DO Number is required";
    }

    if (!formData.grDate) {
      newErrors.grDate = "GR Date is required";
    }

    if (items.length === 0) {
      newErrors.items = "At least one item is required";
    }

    items.forEach((item, index) => {
      if (item.quantityReceived <= 0) {
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
      const submitData: GRFormData = {
        pr_id: formData.prId,
        do_number: formData.doNumber,
        gr_date: formData.grDate,
        notes: formData.notes,
        items: items.map((item) => ({
          prItemId: item.prItemId,
          quantityReceived: item.quantityReceived,
          inspectionNotes: item.inspectionNotes,
        })),
      };

      if (isEdit && id) {
        await warehouseService.updateGoodsReceipt(id, submitData);
        toast.success("Goods Receipt updated successfully");
      } else {
        await warehouseService.createGoodsReceipt(submitData);
        toast.success("Goods Receipt created successfully");
      }

      navigate("/warehouse");
    } catch (error) {
      console.error("Failed to save GR:", error);
      toast.error("Failed to save Goods Receipt");
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
            {isEdit ? "Edit Goods Receipt" : "Create Goods Receipt"}
          </h1>
          <p className="text-sm text-slate-500">
            {isEdit
              ? "Update goods receipt details and items"
              : "Receive goods from supplier and record in warehouse"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Purchase Request Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Purchase Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEdit ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>PR Number</Label>
                  <Input value={formData.prNumber} disabled />
                </div>
                <div>
                  <Label>DO Number</Label>
                  <Input value={formData.doNumber} disabled />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {formData.prId ? (
                    <div className="flex-1 p-4 border rounded-lg bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">
                            {formData.prNumber}
                          </p>
                          <p className="text-sm text-slate-500">
                            Selected PR with {items.length} item(s)
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPRDialog(true)}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setShowPRDialog(true)}
                      className="w-full h-24 border-dashed"
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-6 w-6" />
                        <span>Select Purchase Request</span>
                      </div>
                    </Button>
                  )}
                </div>
                {errors.prId && (
                  <p className="text-sm text-red-500">{errors.prId}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* GR Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              GR Details
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
                  placeholder="DO-2024-XXX"
                />
                {errors.doNumber && (
                  <p className="text-sm text-red-500">{errors.doNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="grDate">
                  GR Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="grDate"
                  type="date"
                  value={formData.grDate}
                  onChange={(e) => {
                    setFormData({ ...formData, grDate: e.target.value });
                    setErrors((prev) => ({ ...prev, grDate: "" }));
                  }}
                />
                {errors.grDate && (
                  <p className="text-sm text-red-500">{errors.grDate}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional notes for this goods receipt..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Received Items
            </CardTitle>
            <div className="text-sm text-slate-500">
              {items.length} item(s) selected
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
                  Select a Purchase Request to add items
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
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
                        onClick={() => toggleItemSelection(item.prItemId)}
                        disabled={isEdit}
                      >
                        {selectedMaterials[item.prItemId] ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Trash2 className="h-5 w-5 text-red-500" />
                        )}
                      </Button>
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Material Name</Label>
                        <Input
                          value={
                            availablePRs
                              .find((pr) => pr.id === formData.prId)
                              ?.items.find((i) => i.id === item.prItemId)
                              ?.productName
                          }
                          disabled
                        />
                        <div className="text-xs text-slate-500">
                          {
                            availablePRs
                              .find((pr) => pr.id === formData.prId)
                              ?.items.find((i) => i.id === item.prItemId)
                              ?.productCode
                          }
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity to Receive</Label>
                        <Input
                          type="number"
                          min={0}
                          value={item.quantityReceived}
                          onChange={(e) =>
                            updateItem(index, "quantityReceived", parseInt(e.target.value) || 0)
                          }
                          disabled={!selectedMaterials[item.prItemId] && !isEdit}
                        />
                        <div className="text-xs text-slate-500 flex justify-between">
                          <span>Requested: {
                            availablePRs
                              .find((pr) => pr.id === formData.prId)
                              ?.items.find((i) => i.id === item.prItemId)
                              ?.quantity
                          }</span>
                          <span>Unit: {
                            availablePRs
                              .find((pr) => pr.id === formData.prId)
                              ?.items.find((i) => i.id === item.prItemId)
                              ?.unit
                          }</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-32 space-y-2">
                      <Label>Inspection Notes</Label>
                      <Input
                        value={item.inspectionNotes || ""}
                        onChange={(e) => updateItem(index, "inspectionNotes", e.target.value)}
                        placeholder="Inspection notes..."
                      />
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
            {isEdit ? "Update Goods Receipt" : "Create Goods Receipt"}
          </Button>
        </div>
      </form>

      {/* PR Selection Dialog */}
      <Dialog open={showPRDialog} onOpenChange={setShowPRDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Purchase Request</DialogTitle>
            <DialogDescription>
              Choose a Purchase Request to create goods receipt from.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto py-4">
            {prLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : availablePRs.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="font-medium">No approved PRs found</p>
                <p className="text-sm">
                  Create and approve a Purchase Request first
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PR Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availablePRs.map((pr) => {
                    const totalAmount = pr.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );
                    return (
                      <TableRow key={pr.id}>
                        <TableCell className="font-medium">
                          {pr.prNumber}
                        </TableCell>
                        <TableCell>{pr.supplierName}</TableCell>
                        <TableCell>{pr.items.length} item(s)</TableCell>
                        <TableCell>{formatQuantity(totalAmount, "PC")}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => selectPR(pr)}>
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simple Textarea component since it might not exist
function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

// Dialog components (simplified for now)
function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        {children}
      </div>
    </div>
  );
}

function DialogContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

function DialogHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mb-4">{children}</div>;
}

function DialogTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>;
}

function DialogDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-sm text-slate-500">{children}</p>;
}
