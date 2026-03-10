import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Play,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Package,
  Loader2,
  AlertTriangle,
  Trash2,
  Plus,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { productionService } from "@/services/productionService";
import type { WorkOrder, WOStep } from "@/types/production";
import {
  WOStatus,
  woStatusColors,
  woStepStatusColors,
  QCResult,
  canWOEdit,
  canWOCancel,
  canMarkForQC,
  canUpdateProgress,
} from "@/types/production";
import { cn } from "@/lib/utils";

export function WorkOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wo, setWO] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog states
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showQCDialog, setShowQCDialog] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WOStep | null>(null);

  // Form states
  const [cancelReason, setCancelReason] = useState("");
  const [qcResult, setQCResult] = useState<QCResult>(QCResult.PASS);
  const [findings, setFindings] = useState<QCFindingFormData[]>([]);
  const [progressData, setProgressData] = useState({
    quantityDone: 0,
    notes: "",
  });

  interface QCFindingFormData {
    description: string;
    reworkNotes: string;
  }

  useEffect(() => {
    if (id) {
      loadWO();
    }
  }, [id]);

  const loadWO = async () => {
    setLoading(true);
    try {
      const data = await productionService.getWOById(id!);
      setWO(data);
    } catch (error) {
      console.error("Failed to load WO:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStepProgress = (stepId: string): number => {
    if (!wo) return 0;
    const progress = (wo.progress ?? [])
      .filter((p) => p.stepId === stepId)
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())[0];
    return progress?.quantityDone ?? 0;
  };

  const calculateOverallProgress = (): number => {
    if (!wo || (wo.steps ?? []).length === 0) return 0;

    const totalProgress = (wo.steps ?? []).reduce((sum, step) => {
      const stepProgress = getStepProgress(step.id);
      return sum + stepProgress;
    }, 0);

    return Math.round((totalProgress / ((wo.quantity ?? 0) * (wo.steps ?? []).length)) * 100);
  };

  const handleRelease = async () => {
    if (!wo) return;
    setActionLoading(true);
    try {
      await productionService.releaseWO(wo.id);
      await loadWO();
    } catch (error) {
      console.error("Failed to release WO:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStart = async () => {
    if (!wo) return;
    setActionLoading(true);
    try {
      await productionService.startWO(wo.id);
      await loadWO();
    } catch (error) {
      console.error("Failed to start WO:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!wo) return;
    setActionLoading(true);
    try {
      await productionService.cancelWO(wo.id, { reason: cancelReason });
      setShowCancelDialog(false);
      await loadWO();
    } catch (error) {
      console.error("Failed to cancel WO:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkForQC = async () => {
    if (!wo) return;
    setActionLoading(true);
    try {
      await productionService.markForQC(wo.id);
      await loadWO();
    } catch (error) {
      console.error("Failed to mark for QC:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    if (!wo || !selectedStep) return;
    setActionLoading(true);
    try {
      await productionService.updateProgress(wo.id, {
        stepId: selectedStep.id,
        quantity: progressData.quantityDone,
        notes: progressData.notes,
      });
      setShowProgressDialog(false);
      setProgressData({ quantityDone: 0, notes: "" });
      await loadWO();
    } catch (error) {
      console.error("Failed to update progress:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitQC = async () => {
    if (!wo) return;
    setActionLoading(true);
    try {
      // Start or get active QC session
      let session = await productionService.getActiveQCSession(wo.id);
      if (!session) {
        session = await productionService.startQC(wo.id);
      }

      // Add findings if QC failed
      if (qcResult === QCResult.FAIL) {
        for (const f of findings) {
          await productionService.addQCFinding(session.id!, {
            description: f.description,
            reworkNotes: f.reworkNotes,
          });
        }
      }

      // Complete the QC session
      await productionService.completeQC(session.id!, qcResult as "pass" | "fail");

      setShowQCDialog(false);
      setQCResult(QCResult.PASS);
      setFindings([]);
      await loadWO();
    } catch (error) {
      console.error("Failed to submit QC:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const addFinding = () => {
    setFindings([...findings, { description: "", reworkNotes: "" }]);
  };

  const updateFinding = (index: number, field: keyof QCFindingFormData, value: string) => {
    const updated = [...findings];
    updated[index][field] = value;
    setFindings(updated);
  };

  const removeFinding = (index: number) => {
    setFindings(findings.filter((_, i) => i !== index));
  };

  const openProgressDialog = (step: WOStep) => {
    setSelectedStep(step);
    const currentProgress = getStepProgress(step.id);
    setProgressData({
      quantityDone: currentProgress,
      notes: "",
    });
    setShowProgressDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!wo) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Package className="h-12 w-12 text-slate-300 mb-4" />
        <p className="font-medium">Work Order not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/production")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/production")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{wo.woNumber ?? "WO"}</h1>
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5",
                  woStatusColors[wo.status ?? "draft"].bg,
                  woStatusColors[wo.status ?? "draft"].text,
                  woStatusColors[wo.status ?? "draft"].border
                )}
              >
                {wo.status === WOStatus.IN_PROGRESS && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {wo.status ?? "draft"}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Plan: {wo.planNumber ?? "-"} | Product: {wo.productCode ?? "-"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {canWOEdit(wo.status ?? "draft") && (
            <Button
              variant="outline"
              onClick={() => navigate(`/production/${wo.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {(wo.status ?? "draft") === WOStatus.DRAFT && (
            <Button onClick={handleRelease} disabled={actionLoading}>
              <Play className="h-4 w-4 mr-2" />
              Release
            </Button>
          )}
          {(wo.status ?? "draft") === WOStatus.RELEASED && (
            <Button onClick={handleStart} disabled={actionLoading}>
              <Play className="h-4 w-4 mr-2" />
              Start WO
            </Button>
          )}
          {canMarkForQC(wo.status ?? "draft") && (wo.steps ?? []).every((s) => s.status === "completed") && (
            <Button onClick={handleMarkForQC} disabled={actionLoading}>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Mark for QC
            </Button>
          )}
          {(wo.status ?? "draft") === WOStatus.QC && (
            <Button onClick={() => setShowQCDialog(true)}>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              QC Inspection
            </Button>
          )}
          {canWOCancel(wo.status ?? "draft") && (
            <Button
              variant="destructive"
              onClick={() => setShowCancelDialog(true)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Overall Progress</h3>
              <p className="text-sm text-slate-500">
                {(wo.steps ?? []).filter((s) => s.status === "completed").length} of{" "}
                {(wo.steps ?? []).length} steps completed
              </p>
            </div>
            <div className="text-2xl font-bold text-slate-900">{overallProgress}%</div>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Steps */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Production Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(wo.steps ?? []).length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>No steps defined</p>
                </div>
              ) : (
                (wo.steps ?? [])
                  .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
                  .map((step, index) => {
                    const stepProgress = getStepProgress(step.id);
                    const progressPercent = Math.round((stepProgress / (wo.quantity ?? 1)) * 100);

                    return (
                      <div
                        key={step.id}
                        className={cn(
                          "border rounded-lg p-4",
                          step.status === "in_progress" && "border-blue-200 bg-blue-50/50"
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                                step.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : step.status === "in_progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-600"
                              )}
                            >
                              {step.status === "completed" ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">
                                {step.operationName ?? step.name ?? "Step"}
                              </h4>
                              <p className="text-xs text-slate-500">
                                Est. time: {step.estimatedTime ?? 0} min
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              woStepStatusColors[step.status ?? "pending"].bg,
                              woStepStatusColors[step.status ?? "pending"].text,
                              woStepStatusColors[step.status ?? "pending"].border
                            )}
                          >
                            {step.status ?? "pending"}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Progress</span>
                            <span className="font-medium">
                              {stepProgress} / {wo.quantity ?? 0} ({progressPercent}%)
                            </span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>

                        {canUpdateProgress(wo.status ?? "draft") && step.status !== "completed" && (
                          <div className="mt-3 pt-3 border-t">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openProgressDialog(step)}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Update Progress
                            </Button>
                          </div>
                        )}

                        {step.actualStart && (
                          <div className="mt-3 pt-3 border-t text-xs text-slate-500">
                            Started: {formatDateTime(step.actualStart)}
                            {step.actualEnd && (
                              <span> | Completed: {formatDateTime(step.actualEnd)}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </CardContent>
          </Card>

          {/* QC History */}
          {(wo.qcSessions ?? []).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">QC History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(wo.qcSessions ?? []).map((session, index) => (
                  <div key={session.id ?? index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">QC #{index + 1}</span>
                        <span className="text-sm text-slate-500">
                          by {session.qcByName ?? "Unknown"}
                        </span>
                      </div>
                      <Badge
                        variant={session.result === QCResult.PASS ? "default" : "destructive"}
                      >
                        {session.result === QCResult.PASS ? (
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                        )}
                        {session.result ?? "pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">
                      {formatDateTime(session.qcAt)}
                    </p>
                    {(session.findings ?? []).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">Findings:</p>
                        {(session.findings ?? []).map((finding, findingIndex) => (
                          <div
                            key={finding.id ?? findingIndex}
                            className="bg-amber-50 border border-amber-200 rounded p-3 text-sm"
                          >
                            <p className="font-medium text-amber-900">
                              {finding.description ?? "No description"}
                            </p>
                            <p className="text-amber-700 mt-1">
                              Rework: {finding.reworkNotes ?? "N/A"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">WO Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Product</p>
                  <p className="font-medium text-slate-900">{wo.productName ?? "-"}</p>
                  <p className="text-xs text-slate-500">{wo.productCode ?? "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Quantity</p>
                  <p className="font-medium text-slate-900">{wo.quantity ?? 0} units</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Target Date</p>
                    <p className="font-medium text-slate-900">
                      {formatDate(wo.targetDate)}
                    </p>
                  </div>
                </div>
                {wo.startDate && (
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Start Date</p>
                      <p className="font-medium text-slate-900">
                        {formatDate(wo.startDate)}
                      </p>
                    </div>
                  </div>
                )}
                {wo.endDate && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Completed</p>
                      <p className="font-medium text-slate-900">
                        {formatDate(wo.endDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-slate-500">Created</p>
                <p className="text-sm text-slate-900">
                  {formatDateTime(wo.createdAt)} by {wo.createdBy ?? "Unknown"}
                </p>
              </div>
              {wo.releasedAt && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Released</p>
                  <p className="text-sm text-slate-900">
                    {formatDateTime(wo.releasedAt)} by {wo.releasedBy}
                  </p>
                </div>
              )}
              {wo.cancelledAt && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Cancelled</p>
                  <p className="text-sm text-slate-900">
                    {formatDateTime(wo.cancelledAt)} by {wo.cancelledBy}
                  </p>
                  {wo.cancellationReason && (
                    <p className="text-sm text-red-600">
                      Reason: {wo.cancellationReason}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rework Notes */}
          {wo.reworkNotes && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                  <AlertTriangle className="h-5 w-5" />
                  Rework Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-800">{wo.reworkNotes}</p>
              </CardContent>
            </Card>
          )}

          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Steps</span>
                <span className="font-medium">{(wo.steps ?? []).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Completed</span>
                <span className="font-medium text-green-600">
                  {(wo.steps ?? []).filter((s) => s.status === "completed").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">In Progress</span>
                <span className="font-medium text-blue-600">
                  {(wo.steps ?? []).filter((s) => s.status === "in_progress").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Pending</span>
                <span className="font-medium text-slate-500">
                  {(wo.steps ?? []).filter((s) => s.status === "pending").length}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Progress Records</span>
                <span className="font-medium">{(wo.progress ?? []).length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Work Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this work order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Cancellation Reason (optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={actionLoading}>
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Progress Update Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Progress - {selectedStep?.operationName}</DialogTitle>
            <DialogDescription>
              Update the quantity completed for this step.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity Done (max: {wo.quantity ?? 0})
              </Label>
              <Input
                id="quantity"
                type="number"
                min={0}
                max={wo.quantity ?? 0}
                value={progressData.quantityDone}
                onChange={(e) =>
                  setProgressData({
                    ...progressData,
                    quantityDone: Math.min(
                      parseInt(e.target.value) || 0,
                      wo.quantity ?? 0
                    ),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes..."
                value={progressData.notes}
                onChange={(e) =>
                  setProgressData({ ...progressData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProgressDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProgress} disabled={actionLoading}>
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QC Dialog */}
      <Dialog open={showQCDialog} onOpenChange={setShowQCDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>QC Inspection</DialogTitle>
            <DialogDescription>
              Perform quality control inspection for this work order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>QC Result</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={qcResult === QCResult.PASS ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setQCResult(QCResult.PASS)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Pass
                </Button>
                <Button
                  type="button"
                  variant={qcResult === QCResult.FAIL ? "destructive" : "outline"}
                  className="flex-1"
                  onClick={() => setQCResult(QCResult.FAIL)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Fail
                </Button>
              </div>
            </div>

            {qcResult === QCResult.FAIL && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Findings</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addFinding}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Finding
                  </Button>
                </div>
                {findings.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Add at least one finding for failed QC.
                  </p>
                )}
                {findings.map((finding, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Finding #{index + 1}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFinding(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe the issue..."
                        value={finding.description}
                        onChange={(e) =>
                          updateFinding(index, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rework Notes</Label>
                      <Textarea
                        placeholder="Instructions for rework..."
                        value={finding.reworkNotes}
                        onChange={(e) =>
                          updateFinding(index, "reworkNotes", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQCDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitQC}
              disabled={actionLoading || (qcResult === QCResult.FAIL && findings.length === 0)}
              variant={qcResult === QCResult.FAIL ? "destructive" : "default"}
            >
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit QC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
