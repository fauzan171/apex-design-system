import { Search, Filter, MoreVertical, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inventoryData = [
  { id: 1, sku: "RM-001", name: "Steel Coil 2mm", category: "Raw Material", stock: 1250, uom: "KG", location: "A-01", status: "in-stock" },
  { id: 2, sku: "RM-002", name: "Steel Coil 3mm", category: "Raw Material", stock: 890, uom: "KG", location: "A-02", status: "in-stock" },
  { id: 3, sku: "RM-003", name: "Flat Bar 25x5", category: "Raw Material", stock: 45, uom: "PCS", location: "B-01", status: "low-stock" },
  { id: 4, sku: "SF-001", name: "Cut Pieces", category: "Semi-Finished", stock: 320, uom: "PCS", location: "C-01", status: "in-stock" },
  { id: 5, sku: "FG-001", name: "Finished Gate", category: "Finished Goods", stock: 12, uom: "PCS", location: "D-01", status: "in-stock" },
  { id: 6, sku: "RM-004", name: "Angle 40x40", category: "Raw Material", stock: 8, uom: "PCS", location: "B-02", status: "low-stock" },
];

export function InventoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and track stock levels across all warehouse locations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button>Import Data</Button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by SKU, name..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="raw">Raw Materials</SelectItem>
            <SelectItem value="semi">Semi-Finished</SelectItem>
            <SelectItem value="finished">Finished Goods</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right font-medium">{item.stock.toLocaleString()}</TableCell>
                  <TableCell>{item.uom}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        item.status === "in-stock"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {item.status.replace("-", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                        <DropdownMenuItem>Transfer</DropdownMenuItem>
                        <DropdownMenuItem>Reorder</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
