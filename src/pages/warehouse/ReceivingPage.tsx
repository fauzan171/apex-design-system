import { Package, CheckCircle, Truck, Calendar, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReceivingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Goods Receiving</h1>
          <p className="text-sm text-slate-500 mt-1">
            Record incoming goods and update inventory levels
          </p>
        </div>
        <Button>Create Receipt</Button>
      </div>

      {/* New Receipt Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            New Goods Receipt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="po-number">PO Number</Label>
              <Input id="po-number" placeholder="PO-2026-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s1">PT. Steel Supplier A</SelectItem>
                  <SelectItem value="s2">PT. Metal Trading B</SelectItem>
                  <SelectItem value="s3">CV. Iron Supply C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Receipt Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input id="date" type="date" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ref">Reference</Label>
              <Input id="ref" placeholder="GR-2026-001" />
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Items Received</h3>
              <Button variant="outline" size="sm">
                Add Item
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-right">Ordered Qty</TableHead>
                  <TableHead className="text-right">Received Qty</TableHead>
                  <TableHead>UOM</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell>RM-00{i}</TableCell>
                    <TableCell>Steel Coil {i}mm</TableCell>
                    <TableCell className="text-right">1000</TableCell>
                    <TableCell className="text-right">
                      <Input type="number" defaultValue={1000} className="w-24" />
                    </TableCell>
                    <TableCell>KG</TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A-01">A-01</SelectItem>
                          <SelectItem value="A-02">A-02</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        Matched
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Notes & Submit */}
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Add any notes about this receipt..." />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline">Save Draft</Button>
                <Button className="gap-2">
                  <Truck className="h-4 w-4" />
                  Complete Receipt
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Receipts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Qty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4].map((i) => (
                <TableRow key={i}>
                  <TableCell>GR-2026-{String(i).padStart(3, "0")}</TableCell>
                  <TableCell>PO-2026-{String(i).padStart(3, "0")}</TableCell>
                  <TableCell>{i % 2 === 0 ? "PT. Steel Supplier A" : "PT. Metal Trading B"}</TableCell>
                  <TableCell>Mar {7 - i}, 2026</TableCell>
                  <TableCell>{i * 3}</TableCell>
                  <TableCell className="text-right">{i * 1000}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
