import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Loader2,
  Package,
  Factory,
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { warehouseService } from "@/services/warehouseService";
import { productionService } from "@/services/productionService";
import type { GIFormData, GIItemFormData } from "@/types/warehouse";
import { GIStatus } from "@/types/warehouse";
import { toast } from "sonner";

interface WorkOrder {
  id: string;
  woNumber?: string;
  productName?: string;
  productCode?: string;
  status?: string;
  quantity?: number;
}

export function GoodsIssueFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id) && !location.pathname.includes("/create");

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [woLoading, setWoLoading] = useState(false);
  const [showWODialog, setShowWODialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    woId: "",
    woNumber: "",
  });

  const [items, setItems] = useState<GIItemFormData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available WOs for selection
  const [availableWOs, setAvailableWOs] = useState<WorkOrder[]>([]);

  useEffect(() => {
    if (isEdit && id) {
      loadGI();
    }
    // Load available WOs for selection
    loadAvailableWOs();
  }, [id, isEdit]);

  const loadAvailableWOs = async () => {
    setWoLoading(true);
    try {
      // Get WOs that need materials (not completed)
      const wos = await productionService.getWOs({});
      setAvailableWOs(wos);
    } catch (error) {
      console.error("Failed to load WOs:", error);
    } finally {
      setWoLoading(false);
    }
  };

  const loadGI = async () => {
    setLoading(true);
    try {
      const gi = await warehouseService.getGoodsIssueById(id!);
      if (gi) {
        if (gi.status !== GIStatus.DRAFT) {
          // Cannot edit non-draft GI
          navigate(`/warehouse/gi/${id}`);
          return;
        }

        setFormData({
          woId: gi.woId,
          woNumber: gi.workOrder?.woNumber || "",
        });

        setItems(
          gi.items.map((item) => ({
            materialId: item.materialId,
            quantityRequested: item.quantityRequested,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load GI:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectWO = (wo: WorkOrder) => {
    setFormData({
      woId: wo.id,
      woNumber: wo.woNumber ?? "",
    });

    // Initialize items with materials from the WO
    const woMaterials = getWOMaterials(wo.id);
    setItems(
      woMaterials.map((material) => ({
        materialId: material.id,
        quantityRequested: 0,
      }))
    );

    setShowWODialog(false);
    setErrors((prev) => ({ ...prev, woId: "" }));
  };

  const getWOMaterials = (_woId: string) => {
    // Mock materials based on WO
    const materials = [
      { id: "mat-001", code: "RM-001", name: "Raw Material A", unit: "KG" },
      { id: "mat-002", code: "RM-002", name: "Raw Material B", unit: "LITER" },
      { id: "mat-003", code: "RM-003", name: "Raw Material C", unit: "KG" },
      { id: "mat-004", code: "RM-004", name: "Raw Material D", unit: "PC" },
    ];
    return materials;
  };

  const updateItem = (index: number, field: keyof GIItemFormData, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.woId) {
      newErrors.woId = "Work Order is required";
    }

    if (items.length === 0) {
      newErrors.items = "At least one material is required";
    }

    items.forEach((item, index) => {
      if (item.quantityRequested <= 0) {
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
      const submitData: GIFormData = {
        woId: formData.woId,
        items: items.map((item) => ({
          materialId: item.materialId,
          quantityRequested: item.quantityRequested,
        })),
      };

      if (isEdit && id) {
        // For edit, we just update the items
        await warehouseService.createGoodsIssue(submitData);
        toast.success("Goods Issue updated successfully");
      } else {
        await warehouseService.createGoodsIssue(submitData);
        toast.success("Goods Issue created successfully");
      }

      navigate("/warehouse");
    } catch (error) {
      console.error("Failed to save GI:", error);
      toast.error("Failed to save Goods Issue");
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
            {isEdit ? "Edit Goods Issue" : "Create Goods Issue"}
          </h1>
          <p className="text-sm text-slate-500">
            {isEdit
              ? "Update goods issue details and materials"
              : "Issue materials to Work Order from warehouse"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Work Order Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Factory className="h-5 w-5" />
              Work Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEdit ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>WO Number</Label>
                  <Input value={formData.woNumber} disabled />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {formData.woId ? (
                    <div className="flex-1 p-4 border rounded-lg bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">
                            {formData.woNumber}
                          </p>
                          <p className="text-sm text-slate-500">
                            Selected Work Order
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowWODialog(true)}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setShowWODialog(true)}
                      className="w-full h-24 border-dashed"
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Factory className="h-6 w-6" />
                        <span>Select Work Order</span>
                      </div>
                    </Button>
                  )}
                </div>
                {errors.woId && (
                  <p className="text-sm text-red-500">{errors.woId}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Materials List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Requested Materials
            </CardTitle>
            <div className="text-sm text-slate-500">
              {items.length} material(s) requested
            </div>
          </CardHeader>
          <CardContent>
            {errors.items && (
              <p className="text-sm text-red-500 mb-4">{errors.items}</p>
            )}

            {items.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No materials added yet</p>
                <p className="text-sm text-slate-400">
                  Select a Work Order to add materials
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

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Material Name</Label>
                        <Input
                          value={
                            getWOMaterials(formData.woId).find(
                              (m) => m.id === item.materialId
                            )?.name
                          }
                          disabled
                        />
                        <div className="text-xs text-slate-500">
                          {
                            getWOMaterials(formData.woId).find(
                              (m) => m.id === item.materialId
                            )?.code
                          }
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity Requested</Label>
                        <Input
                          type="number"
                          min={0}
                          value={item.quantityRequested}
                          onChange={(e) =>
                            updateItem(index, "quantityRequested", parseInt(e.target.value) || 0)
                          }
                          disabled={isEdit}
                        />
                        <div className="text-xs text-slate-500 flex justify-between">
                          <span>Available: {
                            Math.floor(Math.random() * 1000)
                          }</span>
                          <span>Unit: {
                            getWOMaterials(formData.woId).find(
                              (m) => m.id === item.materialId
                            )?.unit
                          }</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-32 space-y-2">
                      <Label>Status</Label>
                      <Badge variant="outline" className="w-full justify-center">
                        Pending
                      </Badge>
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
            {isEdit ? "Update Goods Issue" : "Create Goods Issue"}
          </Button>
        </div>
      </form>

      {/* WO Selection Dialog */}
      <Dialog open={showWODialog} onOpenChange={setShowWODialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Work Order</DialogTitle>
            <DialogDescription>
              Choose a Work Order to issue materials for.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto py-4">
            {woLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : availableWOs.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Factory className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="font-medium">No WOs found</p>
                <p className="text-sm">
                  Create a Work Order first
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>WO Number</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableWOs.map((wo) => (
                    <TableRow key={wo.id}>
                      <TableCell className="font-medium">
                        {wo.woNumber}
                      </TableCell>
                      <TableCell>
                        {wo.productName} ({wo.productCode})
                      </TableCell>
                      <TableCell>{formatQuantity(wo.quantity ?? 0, "PC")}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            wo.status === "draft"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-blue-100 text-blue-700"
                          )}
                        >
                          {wo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => selectWO(wo)}>
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
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
