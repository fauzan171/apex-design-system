import { Table2, TrendingUp, TrendingDown, Users, DollarSign, Package, Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const statsCards = [
  {
    title: 'Total Production',
    value: '12,450',
    unit: 'units',
    change: '+12%',
    trend: 'up',
    icon: Package,
    description: 'vs last month',
  },
  {
    title: 'Revenue',
    value: 'Rp 2.4M',
    unit: '',
    change: '+8%',
    trend: 'up',
    icon: DollarSign,
    description: 'vs last month',
  },
  {
    title: 'Active Orders',
    value: '156',
    unit: '',
    change: '-3%',
    trend: 'down',
    icon: TrendingUp,
    description: 'vs last week',
  },
  {
    title: 'Employees',
    value: '248',
    unit: '',
    change: '+5',
    trend: 'up',
    icon: Users,
    description: 'new hires',
  },
];

const tableData = [
  { id: 'PO-001', product: 'Steel Beam 100x100', quantity: 500, status: 'Completed', date: '2025-02-25' },
  { id: 'PO-002', product: 'Iron Rod 12mm', quantity: 1200, status: 'In Progress', date: '2025-02-26' },
  { id: 'PO-003', product: 'Steel Plate 5mm', quantity: 300, status: 'Pending', date: '2025-02-27' },
  { id: 'PO-004', product: 'Angle Bar 50x50', quantity: 800, status: 'Completed', date: '2025-02-24' },
  { id: 'PO-005', product: 'Channel Steel 75x40', quantity: 450, status: 'In Progress', date: '2025-02-26' },
];

const timelineData = [
  {
    title: 'Order Received',
    description: 'PO-002 received from PT. Maju Jaya',
    time: '2 hours ago',
    status: 'completed',
    icon: CheckCircle2,
  },
  {
    title: 'Production Started',
    description: 'Iron Rod 12mm production initiated',
    time: '1 hour ago',
    status: 'completed',
    icon: CheckCircle2,
  },
  {
    title: 'Quality Check',
    description: 'Waiting for quality inspection',
    time: '30 minutes ago',
    status: 'current',
    icon: Circle,
  },
  {
    title: 'Ready for Delivery',
    description: 'Pending final approval',
    time: 'Upcoming',
    status: 'pending',
    icon: AlertCircle,
  },
];

const inventoryData = [
  { item: 'Steel Beam 100x100', stock: 850, max: 1000, unit: 'pcs' },
  { item: 'Iron Rod 12mm', stock: 420, max: 1500, unit: 'pcs' },
  { item: 'Steel Plate 5mm', stock: 180, max: 500, unit: 'sheets' },
  { item: 'Angle Bar 50x50', stock: 720, max: 800, unit: 'pcs' },
];

export default function DataDisplaySection() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Statistics Cards</h2>
            <p className="text-muted-foreground">Key metrics and KPI displays</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.value}
                  {stat.unit && <span className="text-sm font-normal text-muted-foreground ml-1">{stat.unit}</span>}
                </div>
                <div className="flex items-center text-xs mt-1">
                  <span className={`${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} font-medium flex items-center`}>
                    {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-2">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Cards Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Table2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Cards</h2>
            <p className="text-muted-foreground">Various card layouts for content display</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Basic Card */}
          <Card>
            <CardHeader>
              <CardTitle>Production Order</CardTitle>
              <CardDescription>Order details and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <span className="text-sm font-medium">PO-002</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Product</span>
                <span className="text-sm font-medium">Iron Rod 12mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <span className="text-sm font-medium">1,200 pcs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="secondary">In Progress</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card with Avatar */}
          <Card>
            <CardHeader>
              <CardTitle>Team Member</CardTitle>
              <CardDescription>Employee information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">Production Manager</p>
                  <Badge variant="outline" className="mt-1">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                System Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                Scheduled maintenance will occur on March 1st, 2025 at 02:00 AM. 
                Please save your work before this time.
              </p>
            </CardContent>
            <CardFooter className="bg-muted/30">
              <p className="text-xs text-muted-foreground">Posted 2 hours ago</p>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Tables Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Table2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Data Tables</h2>
            <p className="text-muted-foreground">Tabular data display with sorting and filtering</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Production Orders</CardTitle>
            <CardDescription>Recent production orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.id}</TableCell>
                    <TableCell>{row.product}</TableCell>
                    <TableCell className="text-right">{row.quantity.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          row.status === 'Completed' ? 'default' : 
                          row.status === 'In Progress' ? 'secondary' : 'outline'
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Timeline Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Timeline</h2>
            <p className="text-muted-foreground">Chronological display of events</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Timeline</CardTitle>
            <CardDescription>Production order progress tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {timelineData.map((item, index) => (
                <div key={item.title} className="flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full ${
                      item.status === 'completed' ? 'bg-green-100 text-green-600' :
                      item.status === 'current' ? 'bg-primary/10 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    {index < timelineData.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-2 ${
                        item.status === 'completed' ? 'bg-green-200' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${
                        item.status === 'pending' ? 'text-muted-foreground' : ''
                      }`}>
                        {item.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <p className={`text-sm mt-1 ${
                      item.status === 'pending' ? 'text-muted-foreground' : 'text-muted-foreground'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Inventory Progress */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Inventory Levels</h2>
            <p className="text-muted-foreground">Stock levels with visual indicators</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {inventoryData.map((item) => {
              const percentage = (item.stock / item.max) * 100;
              return (
                <div key={item.item} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.item}</span>
                    <span className="text-muted-foreground">
                      {item.stock.toLocaleString()} / {item.max.toLocaleString()} {item.unit}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${
                      percentage < 30 ? 'text-red-500' : 
                      percentage < 60 ? 'text-yellow-500' : ''
                    }`}
                  />
                  <div className="flex justify-between text-xs">
                    <span className={`${
                      percentage < 30 ? 'text-red-600' : 
                      percentage < 60 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {percentage < 30 ? 'Low Stock' : percentage < 60 ? 'Moderate' : 'Good'}
                    </span>
                    <span className="text-muted-foreground">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
