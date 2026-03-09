import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  ArrowLeft,
  Loader2,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { productService, bomService } from "@/services/masterDataService";
import type { Product, BoM, BoMStatus } from "@/types/masterData";
import {
  BoMStatus as BoMStatusEnum,
  boMStatusLabels,
  boMStatusColors,
} from "@/types/masterData";
import { cn, formatCurrency } from "@/lib/utils";

export function BoMListPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [boMs, setBoMs] = useState<BoM[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Dialog states
  const [selectedBoM, setSelectedBoM] = useState<BoM | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showObsoleteDialog, setShowObsoleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      loadData();
    }
  }, [productId, statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productData, boMsData] = await Promise.all([
        productService.getProductById(productId!),
        bomService.getBoMs({
          productId,
          status: statusFilter as BoMStatus | "all",
          search: search || undefined,
        }),
      ]);

      if (productData) {
        setProduct(productData);
        setBoMs(boMsData);
      } else {
        navigate("/products");
      }
    } catch (error) {
      console.error("Failed to load BoM data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const handleDelete = async () => {
    if (!selectedBoM) return;
    setActionLoading(true);
    try {
      await bomService.deleteBoM(selectedBoM.id);
      setShowDeleteDialog(false);
      setSelectedBoM(null);
      loadData();
    } catch (error) {
      console.error("Failed to delete BoM:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!selectedBoM) return;
    setActionLoading(true);
    try {
      await bomService.activateBoM(selectedBoM.id);
      setShowActivateDialog(false);
      setSelectedBoM(null);
      loadData();
    } catch (error) {
      console.error("Failed to activate BoM:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleObsolete = async () => {
    if (!selectedBoM) return;
    setActionLoading(true);
    try {
      await bomService.obsoleteBoM(selectedBoM.id);
      setShowObsoleteDialog(false);
      setSelectedBoM(null);
      loadData();
    } catch (error) {
      console.error("Failed to obsolete BoM:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !product) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Bills of Materials
            </h1>
            <p className="text-sm text-slate-500">
              {product?.code} - {product?.name}
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/products/${productId}/bom/create`)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create BoM
        </Button>
      </div>

      {/* Product Info Card */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-500">Product Code</p>
              <p className="font-medium">{product?.code}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Current Cost</p>
              <p className="font-medium">{formatCurrency(product?.costPrice || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Unit</p>
              <p className="font-medium">{product?.unitOfMeasure}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Has BoM</p>
              <p className="font-medium">{product?.hasBoM ? "Yes" : "No"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by version..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value={BoMStatusEnum.DRAFT}>Draft</SelectItem>
                    <SelectItem value={BoMStatusEnum.ACTIVE}>Active</SelectItem>
                    <SelectItem value={BoMStatusEnum.OBSOLETE}>Obsolete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* BoMs Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : boMs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <FileText className="h-12 w-12 text-slate-300 mb-4" />
              <p className="font-medium">No BoMs found</p>
              <p className="text-sm">Create a new Bill of Materials</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Output Qty</TableHead>
                  <TableHead>Components</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boMs.map((bom) => (
                  <TableRow key={bom.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{bom.version}</span>
                        {bom.isDefault && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            Default
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {bom.quantity} {bom.unitOfMeasure}
                    </TableCell>
                    <TableCell>{bom.components.length} items</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{formatCurrency(bom.totalCost)}</p>
                        <p className="text-xs text-slate-500">
                          Material: {formatCurrency(bom.totalMaterialCost)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          boMStatusColors[bom.status].bg,
                          boMStatusColors[bom.status].text,
                          boMStatusColors[bom.status].border
                        )}
                      >
                        {boMStatusLabels[bom.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(bom.effectiveDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/products/${productId}/bom/${bom.id}/edit`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit BoM
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/products/${productId}/bom/${bom.id}`)}
                          >
                            <Layers className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {bom.status === "draft" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedBoM(bom);
                                  setShowActivateDialog(true);
                                }}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedBoM(bom);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                          {bom.status === "active" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedBoM(bom);
                                  setShowObsoleteDialog(true);
                                }}
                                className="text-amber-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Mark Obsolete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete BoM</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete BoM version {selectedBoM?.version}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Dialog */}
      <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate BoM</DialogTitle>
            <DialogDescription>
              Are you sure you want to activate BoM version {selectedBoM?.version}?
              This will make it the default BoM for {product?.name} and mark other
              versions as obsolete.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleActivate} disabled={actionLoading} className="bg-green-600 hover:bg-green-700">
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Check className="h-4 w-4 mr-2" />
              Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Obsolete Dialog */}
      <Dialog open={showObsoleteDialog} onOpenChange={setShowObsoleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark BoM Obsolete</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark BoM version {selectedBoM?.version} as
              obsolete? This BoM will no longer be used for production.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowObsoleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleObsolete} disabled={actionLoading} variant="secondary">
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Mark Obsolete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
