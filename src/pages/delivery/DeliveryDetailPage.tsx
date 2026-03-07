import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  Download,
  Upload,
  X,
  Printer,
  Check,
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
import { deliveryService } from "@/data/mockDeliveryData";
import type { DeliveryOrder } from "@/types/delivery";
import { DOStatus, doStatusColors, canTransitionTo } from "@/types/delivery";
import { cn } from "@/lib/utils";

export function DeliveryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [do_, setDO] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialogs
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<DOStatus | null>(null);
  const [statusNotes, setStatusNotes] = useState("");
  const [showBASTDialog, setShowBASTDialog] = useState(false);
  const [bastFile, setBASTFile] = useState<File | null>(null);
  const [bastReceivedDate, setBASTReceivedDate] = useState("");
  const [bastNotes, setBASTNotes] = useState("");

  useEffect(() => {
    loadDO();
  }, [id]);

  const loadDO = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await deliveryService.getDOById(id);
      setDO(data);
    } catch (error) {
      console.error("Failed to load DO:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!do_ || !newStatus) return;
    setActionLoading(true);
    try {
      await deliveryService.updateDOStatus(do_.id, newStatus, statusNotes);
      setShowStatusDialog(false);
      setNewStatus(null);
      setStatusNotes("");
      loadDO();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!do_ || !cancelReason.trim()) return;
    setActionLoading(true);
    try {
      await deliveryService.cancelDO(do_.id, cancelReason);
      setShowCancelDialog(false);
      setCancelReason("");
      loadDO();
    } catch (error) {
      console.error("Failed to cancel DO:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUploadBAST = async () => {
    if (!do_ || !bastFile || !bastReceivedDate) return;
    setActionLoading(true);
    try {
      await deliveryService.uploadBAST(do_.id, bastFile, bastReceivedDate, bastNotes);
      setShowBASTDialog(false);
      setBASTFile(null);
      setBASTReceivedDate("");
      setBASTNotes("");
      loadDO();
    } catch (error) {
      console.error("Failed to upload BAST:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = () => {
    if (do_) {
      deliveryService.printDO(do_);
    }
  };

  const handleExportPackingList = async () => {
    if (!do_) return;
    try {
      await deliveryService.exportPackingList(do_.id);
    } catch (error) {
      console.error("Failed to export packing list:", error);
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

  const getStatusIcon = (status: DOStatus) => {
    switch (status) {
      case DOStatus.DRAFT:
        return <FileText className="h-4 w-4" />;
      case DOStatus.RELEASED:
      case DOStatus.IN_TRANSIT:
      case DOStatus.DELIVERED:
        return <Truck className="h-4 w-4" />;
      case DOStatus.RECEIVED:
        return <CheckCircle2 className="h-4 w-4" />;
      case DOStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getProgressPercentage = (status: DOStatus): number => {
    const statusOrder = [
      DOStatus.DRAFT,
      DOStatus.RELEASED,
      DOStatus.IN_TRANSIT,
      DOStatus.DELIVERED,
      DOStatus.RECEIVED,
    ];
    const index = statusOrder.indexOf(status);
    if (index === -1) return 0;
    return ((index + 1) / statusOrder.length) * 100;
  };

  const availableTransitions = do_ ? canTransitionTo[do_.status] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!do_) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <p className="font-medium">Delivery Order not found</p>
        <Button variant="link" onClick={() => navigate("/delivery")}>
          Back to Delivery List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/delivery")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{do_.doNumber}</h1>
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5 font-medium",
                  doStatusColors[do_.status].bg,
                  doStatusColors[do_.status].text,
                  doStatusColors[do_.status].border
                )}
              >
                {getStatusIcon(do_.status)}
                {do_.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {do_.items.length} item{do_.items.length > 1 ? "s" : ""} • Created{" "}
              {formatDate(do_.createdAt)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Status update buttons based on current status */}
          {availableTransitions.length > 0 && (
            <Button
              onClick={() => {
                setNewStatus(availableTransitions[0]);
                setShowStatusDialog(true);
              }}
              disabled={actionLoading}
              className="gap-2"
            >
              {availableTransitions[0] === DOStatus.RELEASED && (
                <>
                  <Truck className="h-4 w-4" />
                  Release DO
                </>
              )}
              {availableTransitions[0] === DOStatus.IN_TRANSIT && (
                <>
                  <Truck className="h-4 w-4" />
                  Mark In Transit
                </>
              )}
              {availableTransitions[0] === DOStatus.DELIVERED && (
                <>
                  <Check className="h-4 w-4" />
                  Mark Delivered
                </>
              )}
              {availableTransitions[0] === DOStatus.RECEIVED && (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Received
                </>
              )}
            </Button>
          )}

          {/* Upload BAST button for Delivered status */}
          {do_.status === DOStatus.DELIVERED && !do_.bast && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowBASTDialog(true)}
            >
              <Upload className="h-4 w-4" />
              Upload BAST
            </Button>
          )}

          {/* Print & Export */}
          {do_.status !== DOStatus.DRAFT && (
            <>
              <Button variant="outline" className="gap-2" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
                Print DO
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleExportPackingList}>
                <Download className="h-4 w-4" />
                Export Packing List
              </Button>
            </>
          )}

          {/* Edit button for Draft */}
          {do_.status === DOStatus.DRAFT && (
            <Button
              variant="outline"
              onClick={() => navigate(`/delivery/${do_.id}/edit`)}
            >
              Edit DO
            </Button>
          )}

          {/* Cancel button */}
          {do_.status !== DOStatus.CANCELLED && do_.status !== DOStatus.RECEIVED && (
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowCancelDialog(true)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel DO
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {do_.status !== DOStatus.CANCELLED && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Delivery Progress</span>
              <span className="text-sm text-slate-500">
                {Math.round(getProgressPercentage(do_.status))}%
              </span>
            </div>
            <Progress value={getProgressPercentage(do_.status)} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Draft</span>
              <span>Released</span>
              <span>In Transit</span>
              <span>Delivered</span>
              <span>Received</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DO Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">DO Date</p>
                <p className="font-medium text-slate-900">{formatDate(do_.doDate)}</p>
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
                <p className="font-medium text-slate-900">{do_.items.length} items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Quantity</p>
                <p className="font-medium text-slate-900">
                  {do_.items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} units
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {do_.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-slate-600">{do_.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Cancel Reason */}
      {do_.status === DOStatus.CANCELLED && do_.cancelReason && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Cancellation Reason</p>
                <p className="text-red-700 text-sm mt-1">{do_.cancelReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BAST Info */}
      {do_.bast && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              BAST Uploaded
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-green-600">BAST Number</p>
                <p className="font-medium text-green-800">{do_.bast.bastNumber}</p>
              </div>
              <div>
                <p className="text-green-600">Received Date</p>
                <p className="font-medium text-green-800">{formatDate(do_.bast.receivedDate)}</p>
              </div>
              <div>
                <p className="text-green-600">Uploaded At</p>
                <p className="font-medium text-green-800">
                  {formatDateTime(do_.bast.uploadedAt || "")}
                </p>
              </div>
              {do_.bast.notes && (
                <div>
                  <p className="text-green-600">Notes</p>
                  <p className="font-medium text-green-800">{do_.bast.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* DO Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Code</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Unit</TableHead>
                {do_.status !== DOStatus.DRAFT && (
                  <>
                    <TableHead className="text-right">Stock Before</TableHead>
                    <TableHead className="text-right">Stock After</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {do_.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productCode}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  {do_.status !== DOStatus.DRAFT && (
                    <>
                      <TableCell className="text-right text-slate-500">
                        {item.stockBefore?.toLocaleString() ?? "-"}
                      </TableCell>
                      <TableCell className="text-right text-slate-500">
                        {item.stockAfter?.toLocaleString() ?? "-"}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Status History */}
      {do_.statusHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {do_.statusHistory.map((history, index) => (
                <div key={history.id} className="flex items-start gap-3 text-sm">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        history.status === DOStatus.CANCELLED
                          ? "bg-red-500"
                          : history.status === DOStatus.RECEIVED
                          ? "bg-green-500"
                          : "bg-blue-500"
                      )}
                    />
                    {index < do_.statusHistory.length - 1 && (
                      <div className="w-px h-6 bg-slate-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{history.status}</span>
                      <span className="text-slate-400">by</span>
                      <span className="text-slate-700">{history.userName}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {formatDateTime(history.timestamp)}
                    </p>
                    {history.notes && (
                      <p className="text-slate-600 mt-1 italic">"{history.notes}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Delivery Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this DO. This action cannot be undone.
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
              Cancel DO
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
              Confirm status update to {newStatus}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Enter notes..."
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
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BAST Upload Dialog */}
      <Dialog open={showBASTDialog} onOpenChange={setShowBASTDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload BAST from HO
            </DialogTitle>
            <DialogDescription>
              Upload the BAST document received from Head Office.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bastFile">BAST Document</Label>
              <Input
                id="bastFile"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setBASTFile(e.target.files?.[0] || null)}
              />
              {bastFile && (
                <p className="text-sm text-slate-500">Selected: {bastFile.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="receivedDate">Received Date</Label>
              <Input
                id="receivedDate"
                type="date"
                value={bastReceivedDate}
                onChange={(e) => setBASTReceivedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bastNotes">Notes (Optional)</Label>
              <Textarea
                id="bastNotes"
                placeholder="Enter notes..."
                value={bastNotes}
                onChange={(e) => setBASTNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBASTDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUploadBAST}
              disabled={!bastFile || !bastReceivedDate || actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload BAST
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}