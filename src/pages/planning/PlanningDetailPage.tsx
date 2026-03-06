import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  Send,
  ThumbsUp,
  ThumbsDown,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShoppingCart,
  Hammer,
  Check,
  Download,
  FileSpreadsheet,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit3,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { planningService } from "@/data/mockPlanningData";
import type { ProductionPlan, MRItem } from "@/types/planning";
import {
  ProductionPlanStatus,
  MRItemStatus,
  productionPlanStatusColors,
} from "@/types/planning";
import { cn } from "@/lib/utils";

export function PlanningDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<ProductionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // PR Dialog state
  const [showPRDialog, setShowPRDialog] = useState(false);
  const [selectedMRItems, setSelectedMRItems] = useState<MRItem[]>([]);
  const [prRequiredDate, setPRRequiredDate] = useState("");
  const [prNotes, setPRNotes] = useState("");
  const [prLoading, setPRLoading] = useState(false);
  const [currentPlanItemForPR, setCurrentPlanItemForPR] = useState<string>("");

  // WO state
  const [woLoading, setWOLoading] = useState<string | null>(null); // plan item id

  // MR Filter & Sort state
  const [mrFilter, setMRFilter] = useState<"all" | "shortage" | "no-shortage">("all");
  const [mrSortBy, setMRSortBy] = useState<"priority" | "material" | "shortage">("priority");
  const [mrSortOrder, setMRSortOrder] = useState<"asc" | "desc">("desc");

  // P1 Feature states
  const [showRequestEditDialog, setShowRequestEditDialog] = useState(false);
  const [requestEditReason, setRequestEditReason] = useState("");
  const [showWOWarningDialog, setShowWOWarningDialog] = useState(false);
  const [pendingWOPlanItemId, setPendingWOPlanItemId] = useState<string | null>(null);
  const [mrPriorityFilter, setMRPriorityFilter] = useState<"all" | "critical" | "high" | "normal">("all");

  // PR quantity editing state
  const [prItemQuantities, setPRItemQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    loadPlan();
  }, [id]);

  const loadPlan = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await planningService.getPlanById(id);
      setPlan(data);
    } catch (error) {
      console.error("Failed to load plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleApprove = async () => {
    if (!plan) return;
    setActionLoading(true);
    try {
      await planningService.approvePlan(plan.id);
      loadPlan();
    } catch (error) {
      console.error("Failed to approve plan:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!plan || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await planningService.rejectPlan(plan.id, rejectReason);
      setShowRejectDialog(false);
      setRejectReason("");
      loadPlan();
    } catch (error) {
      console.error("Failed to reject plan:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!plan || !cancelReason.trim()) return;
    setActionLoading(true);
    try {
      await planningService.cancelPlan(plan.id, cancelReason);
      setShowCancelDialog(false);
      setCancelReason("");
      loadPlan();
    } catch (error) {
      console.error("Failed to cancel plan:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Open PR dialog for a plan item
  const openPRDialog = (planItemId: string) => {
    const planItem = plan?.items.find((item) => item.id === planItemId);
    if (!planItem) return;

    // Get MR items with shortage and not yet converted to PR
    const itemsWithShortage = planItem.mrItems.filter(
      (mr) => mr.shortageQty > 0 && !mr.prId
    );
    setSelectedMRItems(itemsWithShortage);
    setCurrentPlanItemForPR(planItemId);
    setPRRequiredDate(plan?.targetCompletionDate || "");
    setPRNotes("");
    setShowPRDialog(true);
  };

  // Toggle MR item selection
  const toggleMRItem = (mrItem: MRItem) => {
    setSelectedMRItems((prev) => {
      const isSelected = prev.some((item) => item.id === mrItem.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== mrItem.id);
      } else {
        return [...prev, mrItem];
      }
    });
  };

  // Create PR from selected MR items
  const handleCreatePR = async () => {
    if (!plan || selectedMRItems.length === 0 || !prRequiredDate) return;
    setPRLoading(true);
    try {
      await planningService.createPRFromMR({
        planId: plan.id,
        planNumber: plan.planNumber,
        items: selectedMRItems.map((mr) => ({
          materialId: mr.materialId,
          materialCode: mr.materialCode,
          materialName: mr.materialName,
          quantity: getPRItemQuantity(mr),
          unit: mr.unit,
        })),
        requiredDate: prRequiredDate,
        notes: prNotes,
      });
      setShowPRDialog(false);
      setSelectedMRItems([]);
      setPRItemQuantities({});
      loadPlan();
    } catch (error) {
      console.error("Failed to create PR:", error);
    } finally {
      setPRLoading(false);
    }
  };

  // Filter MR items
  const filterMRItems = (items: MRItem[]) => {
    switch (mrFilter) {
      case "shortage":
        return items.filter((mr) => mr.shortageQty > 0);
      case "no-shortage":
        return items.filter((mr) => mr.shortageQty === 0);
      default:
        return items;
    }
  };

  // Sort MR items
  const sortMRItems = (items: MRItem[]) => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      switch (mrSortBy) {
        case "material":
          comparison = a.materialCode.localeCompare(b.materialCode);
          break;
        case "shortage":
          comparison = a.shortageQty - b.shortageQty;
          break;
        case "priority":
        default:
          comparison = a.priorityWeight - b.priorityWeight;
          break;
      }
      return mrSortOrder === "asc" ? comparison : -comparison;
    });
  };

  // Toggle sort
  const toggleSort = (sortBy: "priority" | "material" | "shortage") => {
    if (mrSortBy === sortBy) {
      setMRSortOrder(mrSortOrder === "asc" ? "desc" : "asc");
    } else {
      setMRSortBy(sortBy);
      setMRSortOrder("desc");
    }
  };

  // Select all shortage items
  const handleSelectAllShortage = () => {
    const planItem = plan?.items.find((item) => item.id === currentPlanItemForPR);
    if (!planItem) return;

    const allShortageItems = planItem.mrItems.filter(
      (mr) => mr.shortageQty > 0 && !mr.prId
    );
    setSelectedMRItems(allShortageItems);
  };

  // Deselect all
  const handleDeselectAll = () => {
    setSelectedMRItems([]);
    setPRItemQuantities({});
  };

  // P1: Request Edit for Approved Plan
  const handleRequestEdit = async () => {
    if (!plan || !requestEditReason.trim()) return;
    setActionLoading(true);
    try {
      await planningService.requestEdit(plan.id, requestEditReason);
      setShowRequestEditDialog(false);
      setRequestEditReason("");
      navigate(`/planning/${plan.id}/edit`);
    } catch (error) {
      console.error("Failed to request edit:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // P1: Mark Plan as Completed
  const handleMarkCompleted = async () => {
    if (!plan) return;
    setActionLoading(true);
    try {
      await planningService.updatePlanStatus(plan.id, ProductionPlanStatus.COMPLETED);
      loadPlan();
    } catch (error) {
      console.error("Failed to mark as completed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // P1: Create WO with warning check
  const handleCreateWOWithCheck = async (planItemId: string) => {
    if (!plan) return;
    const planItem = plan.items.find((item) => item.id === planItemId);
    if (!planItem) return;

    // Check for non-critical shortage
    const nonCriticalShortage = planItem.mrItems.filter(
      (mr) => !mr.isCritical && mr.shortageQty > 0
    );

    if (nonCriticalShortage.length > 0) {
      // Show warning dialog
      setPendingWOPlanItemId(planItemId);
      setShowWOWarningDialog(true);
    } else {
      // Proceed directly
      await executeCreateWO(planItemId);
    }
  };

  // Execute WO creation
  const executeCreateWO = async (planItemId: string) => {
    if (!plan) return;
    const planItem = plan.items.find((item) => item.id === planItemId);
    if (!planItem) return;

    setWOLoading(planItemId);
    try {
      await planningService.createWO({
        planId: plan.id,
        planNumber: plan.planNumber,
        planItemId: planItem.id,
        productId: planItem.productId,
        productCode: planItem.productCode,
        productName: planItem.productName,
        quantity: planItem.quantity,
        unit: planItem.unit,
      });

      // P1: Auto update status to In Progress if this is the first WO
      if (plan.status === ProductionPlanStatus.APPROVED) {
        await planningService.updatePlanStatus(plan.id, ProductionPlanStatus.IN_PROGRESS);
      }

      setShowWOWarningDialog(false);
      setPendingWOPlanItemId(null);
      loadPlan();
    } catch (error) {
      console.error("Failed to create WO:", error);
    } finally {
      setWOLoading(null);
    }
  };

  // P1: Filter MR items by priority level
  const filterMRByPriority = (items: MRItem[]) => {
    switch (mrPriorityFilter) {
      case "critical":
        return items.filter((mr) => mr.isCritical);
      case "high":
        return items.filter((mr) => mr.priorityWeight >= 40 && !mr.isCritical);
      case "normal":
        return items.filter((mr) => mr.priorityWeight < 40);
      default:
        return items;
    }
  };

  // P1: Update PR item quantity
  const updatePRItemQuantity = (mrItemId: string, quantity: number) => {
    setPRItemQuantities((prev) => ({
      ...prev,
      [mrItemId]: quantity,
    }));
  };

  // Get PR item quantity (use shortage qty as default)
  const getPRItemQuantity = (mrItem: MRItem): number => {
    return prItemQuantities[mrItem.id] ?? mrItem.shortageQty;
  };

  // Export MR to CSV
  const handleExportMR = (format: "csv" | "pdf") => {
    if (!plan) return;

    // Prepare data for export
    const exportData: {
      planNumber: string;
      productCode: string;
      productName: string;
      quantity: number;
      materialCode: string;
      materialName: string;
      requiredQty: number;
      availableQty: number;
      shortageQty: number;
      unit: string;
      priorityWeight: number;
      status: string;
    }[] = [];

    plan.items.forEach((item) => {
      item.mrItems.forEach((mr) => {
        exportData.push({
          planNumber: plan.planNumber,
          productCode: item.productCode,
          productName: item.productName,
          quantity: item.quantity,
          materialCode: mr.materialCode,
          materialName: mr.materialName,
          requiredQty: mr.requiredQty,
          availableQty: mr.availableQty,
          shortageQty: mr.shortageQty,
          unit: mr.unit,
          priorityWeight: mr.priorityWeight,
          status: mr.status,
        });
      });
    });

    if (format === "csv") {
      // Generate CSV
      const headers = [
        "Plan Number",
        "Product Code",
        "Product Name",
        "Quantity",
        "Material Code",
        "Material Name",
        "Required Qty",
        "Available Qty",
        "Shortage Qty",
        "Unit",
        "Priority %",
        "Status",
      ];
      const csvContent = [
        headers.join(","),
        ...exportData.map((row) =>
          [
            row.planNumber,
            row.productCode,
            `"${row.productName}"`,
            row.quantity,
            row.materialCode,
            `"${row.materialName}"`,
            row.requiredQty,
            row.availableQty,
            row.shortageQty,
            row.unit,
            row.priorityWeight,
            row.status,
          ].join(",")
        ),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `MR-${plan.planNumber}.csv`;
      link.click();
    } else {
      // For PDF, we'll create a simple HTML table and print it
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>MR Report - ${plan.planNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 18px; margin-bottom: 10px; }
            .info { margin-bottom: 20px; }
            .info p { margin: 4px 0; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
            th { background-color: #f5f5f5; }
            .shortage { color: red; font-weight: bold; }
            .fulfilled { color: green; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>Material Requirement Report</h1>
          <div class="info">
            <p><strong>Plan Number:</strong> ${plan.planNumber}</p>
            <p><strong>HO Order Reference:</strong> ${plan.hoOrderReference}</p>
            <p><strong>Plan Date:</strong> ${formatDate(plan.planDate)}</p>
            <p><strong>Target Completion:</strong> ${formatDate(plan.targetCompletionDate)}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Material</th>
                <th>Required</th>
                <th>Available</th>
                <th>Shortage</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${plan.items
                .map((item) =>
                  item.mrItems
                    .map(
                      (mr) => `
                <tr>
                  <td>${item.productCode}</td>
                  <td>${mr.materialCode} - ${mr.materialName}</td>
                  <td>${mr.requiredQty.toLocaleString()} ${mr.unit}</td>
                  <td>${mr.availableQty.toLocaleString()} ${mr.unit}</td>
                  <td class="${mr.shortageQty > 0 ? "shortage" : ""}">${
                    mr.shortageQty > 0
                      ? `-${mr.shortageQty.toLocaleString()} ${mr.unit}`
                      : "-"
                  }</td>
                  <td>${mr.priorityWeight}%</td>
                  <td class="${mr.status === "Fulfilled" ? "fulfilled" : ""}">${
                    mr.status
                  }</td>
                </tr>
              `
                    )
                    .join("")
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: ProductionPlanStatus) => {
    switch (status) {
      case ProductionPlanStatus.DRAFT:
        return <Clock className="h-4 w-4" />;
      case ProductionPlanStatus.PENDING_APPROVAL:
        return <AlertCircle className="h-4 w-4" />;
      case ProductionPlanStatus.APPROVED:
        return <CheckCircle2 className="h-4 w-4" />;
      case ProductionPlanStatus.IN_PROGRESS:
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case ProductionPlanStatus.COMPLETED:
        return <CheckCircle2 className="h-4 w-4" />;
      case ProductionPlanStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getMRStatusBadge = (status: string) => {
    switch (status) {
      case "Fulfilled":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Fulfilled
          </Badge>
        );
      case "Partial Fulfilled":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Partial
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            Pending
          </Badge>
        );
    }
  };

  const getWOStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            In Progress
          </Badge>
        );
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
            Not Started
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <p className="font-medium">Production Plan not found</p>
        <Button variant="link" onClick={() => navigate("/planning")}>
          Back to Planning List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/planning")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{plan.planNumber}</h1>
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5 font-medium",
                  productionPlanStatusColors[plan.status].bg,
                  productionPlanStatusColors[plan.status].text,
                  productionPlanStatusColors[plan.status].border
                )}
              >
                {getStatusIcon(plan.status)}
                {plan.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              HO Order Reference: {plan.hoOrderReference}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {plan.status === ProductionPlanStatus.DRAFT && (
            <>
              <Button variant="outline" onClick={() => navigate(`/planning/${plan.id}/edit`)}>
                Edit Plan
              </Button>
              <Button
                onClick={async () => {
                  setActionLoading(true);
                  await planningService.submitPlan(plan.id);
                  loadPlan();
                  setActionLoading(false);
                }}
                disabled={actionLoading || plan.items.length === 0}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Submit for Approval
              </Button>
            </>
          )}

          {plan.status === ProductionPlanStatus.PENDING_APPROVAL && (
            <>
              <Button
                variant="outline"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowRejectDialog(true)}
              >
                <ThumbsDown className="h-4 w-4" />
                Reject
              </Button>
              <Button onClick={handleApprove} disabled={actionLoading} className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                Approve
              </Button>
            </>
          )}

          {/* P1: Request Edit for Approved Plan */}
          {plan.status === ProductionPlanStatus.APPROVED && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowRequestEditDialog(true)}
            >
              <Edit3 className="h-4 w-4" />
              Request Edit
            </Button>
          )}

          {/* P1: Mark as Completed for In Progress Plan */}
          {plan.status === ProductionPlanStatus.IN_PROGRESS && (
            <Button
              variant="outline"
              className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={handleMarkCompleted}
              disabled={actionLoading}
            >
              <CheckCircle className="h-4 w-4" />
              Mark Completed
            </Button>
          )}

          {plan.status !== ProductionPlanStatus.CANCELLED &&
            plan.status !== ProductionPlanStatus.COMPLETED && (
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowCancelDialog(true)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Plan
              </Button>
            )}
        </div>
      </div>

      {/* Plan Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Plan Date</p>
                <p className="font-medium text-slate-900">{formatDate(plan.planDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Target Completion</p>
                <p className="font-medium text-slate-900">
                  {formatDate(plan.targetCompletionDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Products</p>
                <p className="font-medium text-slate-900">{plan.items.length} items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {plan.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-slate-600">{plan.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Cancel Reason */}
      {plan.status === ProductionPlanStatus.CANCELLED && plan.cancelReason && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Cancellation Reason</p>
                <p className="text-red-700 text-sm mt-1">{plan.cancelReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Production Plan Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Plan Items</span>
            <div className="flex items-center gap-2">
              {plan.items.length > 0 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleExportMR("csv")}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleExportMR("pdf")}
                  >
                    <Download className="h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              )}
              {plan.status === ProductionPlanStatus.DRAFT && (
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {plan.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Package className="h-12 w-12 text-slate-300 mb-4" />
              <p className="font-medium">No products added yet</p>
              <p className="text-sm">Add products to create Material Requirements</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {plan.items.map((item) => (
                <div key={item.id} className="p-4">
                  {/* Item Header */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        {expandedItems.has(item.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">
                            {item.productCode}
                          </span>
                          <span className="text-slate-500">-</span>
                          <span className="text-slate-700">{item.productName}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                          <span>Qty: {item.quantity} {item.unit}</span>
                          <span className="text-slate-300">|</span>
                          {getMRStatusBadge(item.mrStatus)}
                          <span className="text-slate-300">|</span>
                          {getWOStatusBadge(item.woStatus)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-500">MR Progress</p>
                        <div className="flex items-center gap-2">
                          <Progress value={item.mrProgress} className="w-24 h-2" />
                          <span className="text-sm font-medium">{item.mrProgress}%</span>
                        </div>
                      </div>
                      {item.criticalMrFulfilled ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          WO Ready
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Critical Pending
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Expanded MR Items */}
                  {expandedItems.has(item.id) && item.mrItems.length > 0 && (
                    <div className="mt-4 ml-10 border rounded-lg overflow-hidden">
                      {/* Filter & Sort Controls */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 border-b">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Status:</span>
                            <div className="flex gap-1">
                              <Button
                                variant={mrFilter === "all" ? "default" : "outline"}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setMRFilter("all")}
                              >
                                All
                              </Button>
                              <Button
                                variant={mrFilter === "shortage" ? "default" : "outline"}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setMRFilter("shortage")}
                              >
                                Shortage
                              </Button>
                              <Button
                                variant={mrFilter === "no-shortage" ? "default" : "outline"}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setMRFilter("no-shortage")}
                              >
                                No Shortage
                              </Button>
                            </div>
                          </div>
                          {/* P1: Priority Level Filter */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Priority:</span>
                            <div className="flex gap-1">
                              <Button
                                variant={mrPriorityFilter === "all" ? "default" : "outline"}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setMRPriorityFilter("all")}
                              >
                                All
                              </Button>
                              <Button
                                variant={mrPriorityFilter === "critical" ? "default" : "outline"}
                                size="sm"
                                className="h-7 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                onClick={() => setMRPriorityFilter("critical")}
                              >
                                Critical
                              </Button>
                              <Button
                                variant={mrPriorityFilter === "high" ? "default" : "outline"}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setMRPriorityFilter("high")}
                              >
                                High
                              </Button>
                              <Button
                                variant={mrPriorityFilter === "normal" ? "default" : "outline"}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setMRPriorityFilter("normal")}
                              >
                                Normal
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          {filterMRByPriority(filterMRItems(item.mrItems)).length} items
                        </div>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead
                              className="cursor-pointer hover:bg-slate-100"
                              onClick={() => toggleSort("material")}
                            >
                              <div className="flex items-center gap-1">
                                Material
                                {mrSortBy === "material" && (
                                  mrSortOrder === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                )}
                                {mrSortBy !== "material" && <ArrowUpDown className="h-3 w-3 text-slate-400" />}
                              </div>
                            </TableHead>
                            <TableHead className="text-right">Required</TableHead>
                            <TableHead className="text-right">Available</TableHead>
                            <TableHead
                              className="text-right cursor-pointer hover:bg-slate-100"
                              onClick={() => toggleSort("shortage")}
                            >
                              <div className="flex items-center justify-end gap-1">
                                Shortage
                                {mrSortBy === "shortage" && (
                                  mrSortOrder === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                )}
                                {mrSortBy !== "shortage" && <ArrowUpDown className="h-3 w-3 text-slate-400" />}
                              </div>
                            </TableHead>
                            <TableHead
                              className="text-center cursor-pointer hover:bg-slate-100"
                              onClick={() => toggleSort("priority")}
                            >
                              <div className="flex items-center justify-center gap-1">
                                Priority
                                {mrSortBy === "priority" && (
                                  mrSortOrder === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                )}
                                {mrSortBy !== "priority" && <ArrowUpDown className="h-3 w-3 text-slate-400" />}
                              </div>
                            </TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortMRItems(filterMRByPriority(filterMRItems(item.mrItems)))
                            .map((mrItem) => (
                              <TableRow
                                key={mrItem.id}
                                className={cn(
                                  mrItem.isCritical && "bg-amber-50/50"
                                )}
                              >
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <p className="font-medium">{mrItem.materialCode}</p>
                                      <p className="text-xs text-slate-500">
                                        {mrItem.materialName}
                                      </p>
                                    </div>
                                    {mrItem.isCritical && (
                                      <Badge
                                        variant="outline"
                                        className="bg-red-100 text-red-700 border-red-200 text-xs"
                                      >
                                        Critical
                                      </Badge>
                                    )}
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
                                <TableCell className="text-center">
                                  <Badge variant="outline">{mrItem.priorityWeight}%</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  {mrItem.status === MRItemStatus.FULFILLED ? (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-700 border-green-200"
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Fulfilled
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="bg-slate-50 text-slate-600 border-slate-200"
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      Pending
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {mrItem.shortageQty > 0 && !mrItem.prId && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="gap-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openPRDialog(item.id);
                                      }}
                                    >
                                      <ShoppingCart className="h-3 w-3" />
                                      Create PR
                                    </Button>
                                  )}
                                  {mrItem.prId && (
                                    <span className="text-xs text-slate-500">
                                      PR: {mrItem.prId}
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                      {item.criticalMrFulfilled && item.woStatus === "Not Started" && (
                        <div className="p-3 bg-green-50 border-t flex items-center justify-between">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm">
                              Critical materials fulfilled. Ready to create Work Order.
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => handleCreateWOWithCheck(item.id)}
                            disabled={woLoading === item.id}
                          >
                            {woLoading === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Hammer className="h-4 w-4" />
                            )}
                            Create WO
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval History */}
      {plan.approvalLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Approval History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.approvalLogs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        log.action === "Approve"
                          ? "bg-green-500"
                          : log.action === "Reject" || log.action === "Cancel"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      )}
                    />
                    {index < plan.approvalLogs.length - 1 && (
                      <div className="w-px h-6 bg-slate-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{log.action}</span>
                      <span className="text-slate-400">by</span>
                      <span className="text-slate-700">{log.userName}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {formatDateTime(log.timestamp)}
                    </p>
                    {log.notes && (
                      <p className="text-slate-600 mt-1 italic">"{log.notes}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Production Plan</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this plan.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || actionLoading}
            >
              Reject Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Production Plan</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this plan. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter cancellation reason..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={!cancelReason.trim() || actionLoading}
            >
              Cancel Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create PR Dialog */}
      <Dialog open={showPRDialog} onOpenChange={setShowPRDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Create Purchase Request
            </DialogTitle>
            <DialogDescription>
              Select materials with shortage to create a Purchase Request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Select All / Deselect All */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllShortage}
                >
                  Select All Shortage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                >
                  Deselect All
                </Button>
              </div>
              <span className="text-sm text-slate-500">
                {selectedMRItems.length} selected
              </span>
            </div>

            {/* MR Items Selection */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Shortage</TableHead>
                    <TableHead className="text-center w-28">PR Qty</TableHead>
                    <TableHead className="text-center">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plan?.items
                    .find((item) => item.id === currentPlanItemForPR)
                    ?.mrItems.filter((mr) => mr.shortageQty > 0 && !mr.prId)
                    .sort((a, b) => b.priorityWeight - a.priorityWeight)
                    .map((mrItem) => (
                      <TableRow
                        key={mrItem.id}
                        className={cn(
                          "cursor-pointer",
                          selectedMRItems.some((m) => m.id === mrItem.id) &&
                            "bg-blue-50"
                        )}
                        onClick={() => toggleMRItem(mrItem)}
                      >
                        <TableCell>
                          <div
                            className={cn(
                              "w-4 h-4 border rounded flex items-center justify-center cursor-pointer",
                              selectedMRItems.some((m) => m.id === mrItem.id)
                                ? "bg-blue-600 border-blue-600"
                                : "border-slate-300"
                            )}
                          >
                            {selectedMRItems.some((m) => m.id === mrItem.id) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="font-medium">{mrItem.materialCode}</p>
                              <p className="text-xs text-slate-500">
                                {mrItem.materialName}
                              </p>
                            </div>
                            {mrItem.isCritical && (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-700 border-red-200 text-xs"
                              >
                                Critical
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-red-600 font-medium">
                          {mrItem.shortageQty.toLocaleString()} {mrItem.unit}
                        </TableCell>
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <Input
                            type="number"
                            min={1}
                            max={mrItem.shortageQty}
                            value={getPRItemQuantity(mrItem)}
                            onChange={(e) => updatePRItemQuantity(mrItem.id, parseInt(e.target.value) || mrItem.shortageQty)}
                            className="w-20 h-8 text-center"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{mrItem.priorityWeight}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* PR Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requiredDate">Required Date</Label>
                <Input
                  id="requiredDate"
                  type="date"
                  value={prRequiredDate}
                  onChange={(e) => setPRRequiredDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Selected Items</Label>
                <div className="flex items-center h-10 px-3 bg-slate-50 rounded-md text-sm">
                  {selectedMRItems.length} materials selected
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prNotes">Notes (Optional)</Label>
              <Textarea
                id="prNotes"
                placeholder="Enter notes..."
                value={prNotes}
                onChange={(e) => setPRNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPRDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePR}
              disabled={selectedMRItems.length === 0 || !prRequiredDate || prLoading}
            >
              {prLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              Create PR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Edit Dialog */}
      <Dialog open={showRequestEditDialog} onOpenChange={setShowRequestEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Edit</DialogTitle>
            <DialogDescription>
              Please provide a reason for requesting to edit this approved plan.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason for edit request..."
            value={requestEditReason}
            onChange={(e) => setRequestEditReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRequestEdit}
              disabled={!requestEditReason.trim() || actionLoading}
            >
              Request Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WO Warning Dialog */}
      <Dialog open={showWOWarningDialog} onOpenChange={setShowWOWarningDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Non-Critical Materials Shortage Warning
            </DialogTitle>
            <DialogDescription>
              Some non-critical materials still have shortage. You can proceed to create the Work Order, but production may be affected.
            </DialogDescription>
          </DialogHeader>
          {pendingWOPlanItemId && plan && (
            <div className="py-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Materials with shortage:</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {plan.items
                  .find((item) => item.id === pendingWOPlanItemId)
                  ?.mrItems.filter((mr) => !mr.isCritical && mr.shortageQty > 0)
                  .map((mr) => (
                    <li key={mr.id} className="flex items-center gap-2">
                      <span className="text-amber-500">•</span>
                      {mr.materialCode} - {mr.materialName}:{" "}
                      <span className="text-red-600 font-medium">
                        -{mr.shortageQty.toLocaleString()} {mr.unit}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowWOWarningDialog(false);
                setPendingWOPlanItemId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => pendingWOPlanItemId && executeCreateWO(pendingWOPlanItemId)}
              disabled={woLoading === pendingWOPlanItemId}
              className="gap-2"
            >
              {woLoading === pendingWOPlanItemId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Hammer className="h-4 w-4" />
              )}
              Proceed with WO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}