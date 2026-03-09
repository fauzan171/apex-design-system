import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Package,
  Clock,
  AlertTriangle,
  XCircle,
  Loader2,
  FileText,
  Download,
  Send,
  ThumbsUp,
  ThumbsDown,
  Truck,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { purchasingService } from "@/services/purchasingService";
import type { PurchaseRequest } from "@/types/purchasing";
import {
  PRStatus,
  PRItemStatus,
  prStatusColors,
  canEdit,
  needsApproval,
  canAddDO,
} from "@/types/purchasing";
import { cn } from "@/lib/utils";

export function PurchasingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pr, setPR] = useState<PurchaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialogs
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDODialog, setShowDODialog] = useState(false);
  const [showLeadTimeDialog, setShowLeadTimeDialog] = useState(false);

  // Form states
  const [approveNotes, setApproveNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [newStatus, setNewStatus] = useState<PRStatus | null>(null);
  const [leadTimeDate, setLeadTimeDate] = useState("");

  // DO form
  const [doNumber, setDONumber] = useState("");
  const [doDate, setDODate] = useState("");
  const [doNotes, setDONotes] = useState("");
  const [doDocument, setDODocument] = useState<File | null>(null);
  const [doItems, setDOItems] = useState<{ prItemId: string; quantity: number }[]>([]);

  useEffect(() => {
    loadPR();
  }, [id]);

  const loadPR = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await purchasingService.getPRById(id);
      setPR(data);
    } catch (error) {
      console.error("Failed to load PR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!pr) return;
    setActionLoading(true);
    try {
      await purchasingService.approvePR(pr.id, approveNotes);
      setShowApproveDialog(false);
      setApproveNotes("");
      loadPR();
    } catch (error) {
      console.error("Failed to approve:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!pr || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await purchasingService.rejectPR(pr.id, rejectReason);
      setShowRejectDialog(false);
      setRejectReason("");
      loadPR();
    } catch (error) {
      console.error("Failed to reject:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!pr) return;
    setActionLoading(true);
    try {
      await purchasingService.deletePR(pr.id);
      navigate("/purchasing");
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!pr || !newStatus) return;
    setActionLoading(true);
    try {
      await purchasingService.updatePRStatus(pr.id, newStatus, statusNotes);
      setShowStatusDialog(false);
      setNewStatus(null);
      setStatusNotes("");
      loadPR();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateLeadTime = async () => {
    if (!pr || !leadTimeDate) return;
    setActionLoading(true);
    try {
      await purchasingService.updateLeadTime(pr.id, leadTimeDate);
      setShowLeadTimeDialog(false);
      setLeadTimeDate("");
      loadPR();
    } catch (error) {
      console.error("Failed to update lead time:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddDO = async () => {
    if (!pr || !doNumber || !doDate || doItems.length === 0) return;
    setActionLoading(true);
    try {
      await purchasingService.addDO(pr.id, {
        doNumber,
        doDate,
        notes: doNotes,
        document: doDocument || undefined,
        items: doItems,
      });
      setShowDODialog(false);
      setDONumber("");
      setDODate("");
      setDONotes("");
      setDODocument(null);
      setDOItems([]);
      loadPR();
    } catch (error) {
      console.error("Failed to add DO:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openAddDODialog = () => {
    if (!pr) return;
    setDONumber("");
    setDODate("");
    setDONotes("");
    setDODocument(null);
    setDOItems(pr.items.map((item) => ({ prItemId: item.id, quantity: item.quantity - item.receivedQty })));
    setShowDODialog(true);
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

  const getStatusIcon = (status: PRStatus) => {
    switch (status) {
      case PRStatus.DRAFT:
        return <FileText className="h-4 w-4" />;
      case PRStatus.SUBMITTED:
        return <Clock className="h-4 w-4" />;
      case PRStatus.APPROVED:
        return <CheckCircle className="h-4 w-4" />;
      case PRStatus.REJECTED:
        return <XCircle className="h-4 w-4" />;
      case PRStatus.PROCESSING:
        return <TrendingUp className="h-4 w-4" />;
      case PRStatus.DO_ISSUED:
        return <Truck className="h-4 w-4" />;
      case PRStatus.CLOSED:
        return <Package className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!pr) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <p className="font-medium">Purchase Request not found</p>
        <Button variant="link" onClick={() => navigate("/purchasing")}>
          Back to PR List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/purchasing")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{pr.prNumber}</h1>
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5 font-medium",
                  prStatusColors[pr.status].bg,
                  prStatusColors[pr.status].text,
                  prStatusColors[pr.status].border
                )}
              >
                {getStatusIcon(pr.status)}
                {pr.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {pr.items.length} item{pr.items.length > 1 ? "s" : ""} • Created by {pr.createdByName}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Edit/Delete for Draft */}
          {canEdit(pr.status) && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(`/purchasing/${pr.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}

          {/* Submit for Draft */}
          {pr.status === PRStatus.DRAFT && (
            <Button
              onClick={async () => {
                setActionLoading(true);
                await purchasingService.submitPR(pr.id);
                loadPR();
                setActionLoading(false);
              }}
              disabled={actionLoading}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Submit for Approval
            </Button>
          )}

          {/* Approve/Reject for Submitted */}
          {needsApproval(pr.status) && (
            <>
              <Button
                variant="outline"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowRejectDialog(true)}
              >
                <ThumbsDown className="h-4 w-4" />
                Reject
              </Button>
              <Button
                onClick={() => setShowApproveDialog(true)}
                disabled={actionLoading}
                className="gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                Approve
              </Button>
            </>
          )}

          {/* Processing actions */}
          {pr.status === PRStatus.APPROVED && (
            <Button
              onClick={() => {
                setNewStatus(PRStatus.PROCESSING);
                setShowStatusDialog(true);
              }}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Mark Processing
            </Button>
          )}

          {/* Lead Time for Approved/Processing */}
          {(pr.status === PRStatus.APPROVED || pr.status === PRStatus.PROCESSING) && (
            <Button variant="outline" onClick={() => setShowLeadTimeDialog(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              {pr.leadTimeEstimate ? "Update Lead Time" : "Set Lead Time"}
            </Button>
          )}

          {/* Add DO for Processing/DO Issued */}
          {canAddDO(pr.status) && (
            <Button variant="outline" onClick={openAddDODialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add DO
            </Button>
          )}

          {/* Resubmit for Rejected */}
          {pr.status === PRStatus.REJECTED && (
            <Button
              onClick={async () => {
                setActionLoading(true);
                await purchasingService.updatePRStatus(pr.id, PRStatus.SUBMITTED, "Resubmitted after revision");
                loadPR();
                setActionLoading(false);
              }}
              disabled={actionLoading}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Resubmit
            </Button>
          )}
        </div>
      </div>

      {/* PR Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Request Date</p>
                <p className="font-medium text-slate-900">{formatDate(pr.requestDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Required Date</p>
                <p className="font-medium text-slate-900">{formatDate(pr.requiredDate)}</p>
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
                <p className="text-sm text-slate-500">Total Items</p>
                <p className="font-medium text-slate-900">{pr.items.length} items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Lead Time Est.</p>
                <p className="font-medium text-slate-900">
                  {pr.leadTimeEstimate ? formatDate(pr.leadTimeEstimate) : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source Plan & Notes */}
      {(pr.sourcePlanNumber || pr.notes) && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pr.sourcePlanNumber && (
                <div>
                  <p className="text-sm text-slate-500">Source Plan</p>
                  <p className="font-medium text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/planning/${pr.sourcePlanId}`)}
                  >
                    {pr.sourcePlanNumber}
                  </p>
                </div>
              )}
              {pr.notes && (
                <div>
                  <p className="text-sm text-slate-500">Notes</p>
                  <p className="text-slate-700">{pr.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejection Reason */}
      {pr.status === PRStatus.REJECTED && pr.rejectionReason && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Rejection Reason</p>
                <p className="text-red-700 text-sm mt-1">{pr.rejectionReason}</p>
                {pr.rejectedByName && pr.rejectedAt && (
                  <p className="text-red-600 text-xs mt-2">
                    by {pr.rejectedByName} on {formatDateTime(pr.rejectedAt)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PR Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pr.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.materialCode}</p>
                      <p className="text-xs text-slate-500">{item.materialName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      item.receivedQty === item.quantity ? "text-green-600" :
                      item.receivedQty > 0 ? "text-amber-600" : "text-slate-600"
                    )}>
                      {item.receivedQty.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        item.status === PRItemStatus.RECEIVED && "bg-green-50 text-green-700 border-green-200",
                        item.status === PRItemStatus.PARTIAL && "bg-amber-50 text-amber-700 border-amber-200",
                        item.status === PRItemStatus.PENDING && "bg-slate-50 text-slate-600 border-slate-200"
                      )}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">{item.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delivery Orders */}
      {pr.deliveryOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery Orders ({pr.deliveryOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pr.deliveryOrders.map((do_) => (
              <div key={do_.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-slate-900">{do_.doNumber}</p>
                    <p className="text-sm text-slate-500">{formatDate(do_.doDate)}</p>
                  </div>
                  {do_.documentPath && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download DO
                    </Button>
                  )}
                </div>
                {do_.notes && (
                  <p className="text-sm text-slate-600 mb-3">{do_.notes}</p>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {do_.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.materialCode}</p>
                            <p className="text-xs text-slate-500">{item.materialName}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity.toLocaleString()} {item.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Status History */}
      {pr.statusLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pr.statusLogs.map((log, index) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        log.newStatus === PRStatus.REJECTED
                          ? "bg-red-500"
                          : log.newStatus === PRStatus.APPROVED ||
                            log.newStatus === PRStatus.CLOSED
                          ? "bg-green-500"
                          : "bg-blue-500"
                      )}
                    />
                    {index < pr.statusLogs.length - 1 && (
                      <div className="w-px h-6 bg-slate-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{log.newStatus}</span>
                      {log.oldStatus && (
                        <span className="text-slate-400 text-xs">
                          (from {log.oldStatus})
                        </span>
                      )}
                      <span className="text-slate-400">by</span>
                      <span className="text-slate-700">{log.changedByName}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {formatDateTime(log.changedAt)}
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

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Purchase Request</DialogTitle>
            <DialogDescription>
              Approve this PR to proceed with HO processing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add notes..."
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Purchase Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection.
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
              Reject PR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Purchase Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this PR? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              Delete PR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Update PR status to {newStatus}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Enter notes (e.g., HO confirmed via email)..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lead Time Dialog */}
      <Dialog open={showLeadTimeDialog} onOpenChange={setShowLeadTimeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lead Time Estimation</DialogTitle>
            <DialogDescription>
              Set the estimated delivery date from HO.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Estimated Delivery Date</Label>
              <Input
                type="date"
                value={leadTimeDate || pr.leadTimeEstimate || ""}
                onChange={(e) => setLeadTimeDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeadTimeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLeadTime} disabled={actionLoading || !leadTimeDate}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add DO Dialog */}
      <Dialog open={showDODialog} onOpenChange={setShowDODialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Delivery Order
            </DialogTitle>
            <DialogDescription>
              Add DO information received from HO.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>DO Number *</Label>
                <Input
                  placeholder="e.g., DO-HO-2024-0089"
                  value={doNumber}
                  onChange={(e) => setDONumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>DO Date *</Label>
                <Input
                  type="date"
                  value={doDate}
                  onChange={(e) => setDODate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>DO Document (Optional)</Label>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setDODocument(e.target.files?.[0] || null)}
              />
              {doDocument && (
                <p className="text-sm text-slate-500">Selected: {doDocument.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Enter notes..."
                value={doNotes}
                onChange={(e) => setDONotes(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Items *</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead className="text-center">DO Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pr.items.map((item) => {
                    const pending = item.quantity - item.receivedQty;
                    const doItem = doItems.find((d) => d.prItemId === item.id);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.materialCode}</p>
                            <p className="text-xs text-slate-500">{item.materialName}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{pending.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min={0}
                            max={pending}
                            value={doItem?.quantity || 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setDOItems((prev) =>
                                prev.map((d) =>
                                  d.prItemId === item.id ? { ...d, quantity: Math.min(val, pending) } : d
                                )
                              );
                            }}
                            className="w-20 text-center mx-auto"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDODialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddDO}
              disabled={!doNumber || !doDate || doItems.every((d) => d.quantity === 0) || actionLoading}
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add DO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}