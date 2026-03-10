import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Package,
  ClipboardList,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { productionService } from "@/services/productionService";
import { planningService } from "@/services/planningService";
import type { WOStepFormData } from "@/types/production";
import type { ProductionPlan } from "@/types/planning";
import { WOStatus } from "@/types/production";
import { ProductionPlanStatus } from "@/types/planning";

interface StepFormData {
  id?: string;
  operationName: string;
  estimatedTime: number;
  sequence: number;
}

export function WorkOrderFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id) && !location.pathname.includes("/create");

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    planId: "",
    planNumber: "",
    productId: "",
    productCode: "",
    productName: "",
    quantity: 0,
    targetDate: "",
    notes: "",
  });

  const [steps, setSteps] = useState<StepFormData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      loadWO();
    }
  }, [id, isEdit]);

  const loadWO = async () => {
    setLoading(true);
    try {
      const wo = await productionService.getWOById(id!);
      if (wo) {
        if (wo.status !== WOStatus.DRAFT) {
          // Cannot edit non-draft WO
          navigate(`/production/${id}`);
          return;
        }

        setFormData({
          planId: wo.planId ?? "",
          planNumber: wo.planNumber ?? "",
          productId: wo.productId ?? "",
          productCode: wo.productCode ?? "",
          productName: wo.productName ?? "",
          quantity: wo.quantity ?? 0,
          targetDate: wo.targetDate ?? wo.target_date ?? "",
          notes: wo.notes ?? "",
        });

        setSteps(
          (wo.steps ?? []).map((step) => ({
            id: step.id,
            operationName: step.operationName ?? step.name ?? "",
            estimatedTime: step.estimatedTime ?? 0,
            sequence: step.sequence ?? 0,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load WO:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    setPlansLoading(true);
    try {
      const data = await planningService.getPlans({
        status: ProductionPlanStatus.APPROVED,
      });
      setPlans(data);
    } catch (error) {
      console.error("Failed to load plans:", error);
    } finally {
      setPlansLoading(false);
    }
  };

  const openPlanDialog = () => {
    loadPlans();
    setShowPlanDialog(true);
  };

  const selectPlan = (plan: ProductionPlan) => {
    // Get the first item from the plan
    const firstItem = (plan.items ?? [])[0];
    if (!firstItem) return;

    setFormData({
      ...formData,
      planId: plan.id,
      planNumber: plan.planNumber ?? "",
      productId: firstItem.productId ?? "",
      productCode: firstItem.productCode ?? "",
      productName: firstItem.productName ?? "",
      quantity: firstItem.quantity ?? 0,
      targetDate: plan.targetCompletionDate ?? plan.target_completion_date ?? "",
    });
    setShowPlanDialog(false);
    setErrors((prev) => ({ ...prev, planId: "" }));
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        operationName: "",
        estimatedTime: 30,
        sequence: steps.length + 1,
      },
    ]);
  };

  const updateStep = (index: number, field: keyof StepFormData, value: string | number) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const removeStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index);
    // Re-sequence
    setSteps(
      updated.map((step, i) => ({ ...step, sequence: i + 1 }))
    );
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === steps.length - 1) return;

    const updated = [...steps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];

    // Re-sequence
    setSteps(
      updated.map((step, i) => ({ ...step, sequence: i + 1 }))
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.planId) {
      newErrors.planId = "Production Plan is required";
    }

    if (!formData.targetDate) {
      newErrors.targetDate = "Target date is required";
    }

    if (steps.length === 0) {
      newErrors.steps = "At least one step is required";
    }

    steps.forEach((step, index) => {
      if (!step.operationName.trim()) {
        newErrors[`step_${index}_name`] = "Operation name is required";
      }
      if (step.estimatedTime <= 0) {
        newErrors[`step_${index}_time`] = "Estimated time must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const stepData: WOStepFormData[] = steps.map((step) => ({
        name: step.operationName,
        sequence: step.sequence,
      }));

      if (isEdit && id) {
        await productionService.updateWO(id, {
          target_date: formData.targetDate,
          notes: formData.notes,
        });
      } else {
        await productionService.createWO({
          plan_id: formData.planId,
          product_id: formData.productId,
          quantity: formData.quantity,
          target_date: formData.targetDate,
          notes: formData.notes,
          steps: stepData,
        });
      }

      navigate("/production");
    } catch (error) {
      console.error("Failed to save WO:", error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
          onClick={() => navigate("/production")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Edit Work Order" : "Create Work Order"}
          </h1>
          <p className="text-sm text-slate-500">
            {isEdit
              ? "Update work order details and steps"
              : "Create a new work order from approved production plan"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Production Plan Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Production Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEdit ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Plan Number</Label>
                  <Input value={formData.planNumber} disabled />
                </div>
                <div>
                  <Label>Product</Label>
                  <Input value={formData.productName} disabled />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {formData.planId ? (
                    <div className="flex-1 p-4 border rounded-lg bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">
                            {formData.planNumber}
                          </p>
                          <p className="text-sm text-slate-500">
                            {formData.productName} ({formData.productCode})
                          </p>
                          <p className="text-sm text-slate-500">
                            Qty: {formData.quantity} units
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={openPlanDialog}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={openPlanDialog}
                      className="w-full h-24 border-dashed"
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-6 w-6" />
                        <span>Select Production Plan</span>
                      </div>
                    </Button>
                  )}
                </div>
                {errors.planId && (
                  <p className="text-sm text-red-500">{errors.planId}</p>
                )}
              </div>
            )}

            {formData.planId && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="targetDate">
                    Target Completion Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => {
                      setFormData({ ...formData, targetDate: e.target.value });
                      setErrors((prev) => ({ ...prev, targetDate: "" }));
                    }}
                  />
                  {errors.targetDate && (
                    <p className="text-sm text-red-500">{errors.targetDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    disabled
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Production Steps
            </CardTitle>
            <Button type="button" onClick={addStep} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </CardHeader>
          <CardContent>
            {errors.steps && (
              <p className="text-sm text-red-500 mb-4">{errors.steps}</p>
            )}

            {steps.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No steps defined yet</p>
                <p className="text-sm text-slate-400">
                  Add steps to define the production process
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step, index) => (
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
                        onClick={() => moveStep(index, "up")}
                        disabled={index === 0}
                      >
                        <span className="sr-only">Move up</span>
                        ↑
                      </Button>
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium">
                        {step.sequence}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveStep(index, "down")}
                        disabled={index === steps.length - 1}
                      >
                        <span className="sr-only">Move down</span>
                        ↓
                      </Button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Operation Name</Label>
                        <Input
                          value={step.operationName}
                          onChange={(e) =>
                            updateStep(index, "operationName", e.target.value)
                          }
                          placeholder="e.g., Assembly, Welding"
                        />
                        {errors[`step_${index}_name`] && (
                          <p className="text-sm text-red-500">
                            {errors[`step_${index}_name`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Estimated Time (minutes)</Label>
                        <Input
                          type="number"
                          min={1}
                          value={step.estimatedTime}
                          onChange={(e) =>
                            updateStep(
                              index,
                              "estimatedTime",
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                        {errors[`step_${index}_time`] && (
                          <p className="text-sm text-red-500">
                            {errors[`step_${index}_time`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => removeStep(index)}
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
            onClick={() => navigate("/production")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? "Update Work Order" : "Create Work Order"}
          </Button>
        </div>
      </form>

      {/* Plan Selection Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Production Plan</DialogTitle>
            <DialogDescription>
              Choose an approved production plan to create work order from.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto py-4">
            {plansLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <ClipboardList className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="font-medium">No approved plans found</p>
                <p className="text-sm">
                  Create and approve a production plan first
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Number</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => {
                    const firstItem = (plan.items ?? [])[0];
                    return (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">
                          {plan.planNumber ?? "-"}
                        </TableCell>
                        <TableCell>
                          {firstItem ? (
                            <>
                              <div className="font-medium">{firstItem.productName ?? "-"}</div>
                              <div className="text-xs text-slate-500">
                                {firstItem.productCode ?? "-"}
                              </div>
                            </>
                          ) : (
                            <span className="text-slate-400">No items</span>
                          )}
                        </TableCell>
                        <TableCell>{firstItem?.quantity ?? 0}</TableCell>
                        <TableCell>{formatDate(plan.targetCompletionDate ?? plan.target_completion_date ?? "")}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => selectPlan(plan)}>
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
