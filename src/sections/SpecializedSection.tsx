import { 
  Layers, 
  Plus, 
  Factory, 
  Package, 
  Truck, 
  Users, 
  FileText, 
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const quickActions = [
  { label: 'New Order', icon: Plus, description: 'Create production order', color: 'bg-primary' },
  { label: 'Add Product', icon: Package, description: 'Add new product', color: 'bg-secondary' },
  { label: 'Schedule', icon: Calendar, description: 'View production schedule', color: 'bg-blue-500' },
  { label: 'Reports', icon: BarChart3, description: 'Generate reports', color: 'bg-purple-500' },
];

const recentActivity = [
  { action: 'New order received', detail: 'PO-006 from PT. Sejahtera', time: '5 minutes ago', type: 'order' },
  { action: 'Production completed', detail: 'Steel Beam 100x100 - 500 units', time: '15 minutes ago', type: 'production' },
  { action: 'Inventory updated', detail: 'Iron Rod 12mm stock increased', time: '30 minutes ago', type: 'inventory' },
  { action: 'Quality check passed', detail: 'Batch QC-2025-089 approved', time: '1 hour ago', type: 'quality' },
  { action: 'Delivery scheduled', detail: 'Order DO-045 for tomorrow', time: '2 hours ago', type: 'delivery' },
];

const modules = [
  {
    name: 'Production',
    icon: Factory,
    description: 'Manage production orders and schedules',
    status: 'Active',
    features: ['Order tracking', 'Schedule management', 'Quality control'],
    color: 'bg-blue-500',
  },
  {
    name: 'Inventory',
    icon: Package,
    description: 'Track stock levels and movements',
    status: 'Active',
    features: ['Stock tracking', 'Warehouse management', 'Reorder alerts'],
    color: 'bg-green-500',
  },
  {
    name: 'Sales',
    icon: TrendingUp,
    description: 'Manage orders and customers',
    status: 'Active',
    features: ['Order management', 'Customer database', 'Invoicing'],
    color: 'bg-purple-500',
  },
  {
    name: 'Logistics',
    icon: Truck,
    description: 'Handle deliveries and shipping',
    status: 'Maintenance',
    features: ['Delivery tracking', 'Route optimization', 'Fleet management'],
    color: 'bg-orange-500',
  },
];

const partners = [
  {
    name: 'PT. Maju Jaya',
    code: 'MJ001',
    type: 'Supplier',
    status: 'Active',
    email: 'contact@maju-jaya.co.id',
    phone: '+62 21 1234567',
    address: 'Jl. Sudirman No. 123, Jakarta',
    orders: 45,
  },
  {
    name: 'PT. Sejahtera Abadi',
    code: 'SA002',
    type: 'Customer',
    status: 'Active',
    email: 'info@sejahtera.co.id',
    phone: '+62 21 7654321',
    address: 'Jl. Thamrin No. 456, Jakarta',
    orders: 32,
  },
];

const productionLines = [
  { name: 'Line A - Steel Beams', status: 'Running', efficiency: 92, output: '450 units/day' },
  { name: 'Line B - Iron Rods', status: 'Running', efficiency: 87, output: '1,200 units/day' },
  { name: 'Line C - Steel Plates', status: 'Maintenance', efficiency: 0, output: 'Stopped' },
  { name: 'Line D - Angle Bars', status: 'Running', efficiency: 95, output: '800 units/day' },
];

export default function SpecializedSection() {
  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Quick Actions</h2>
            <p className="text-muted-foreground">Frequently used actions for quick access</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card key={action.label} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">{action.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Recent Activity */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
            <p className="text-muted-foreground">Latest system activities and updates</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0">
                <div className={`p-2 rounded-full ${
                  activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'production' ? 'bg-green-100 text-green-600' :
                  activity.type === 'inventory' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'quality' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'order' ? <FileText className="h-4 w-4" /> :
                   activity.type === 'production' ? <Factory className="h-4 w-4" /> :
                   activity.type === 'inventory' ? <Package className="h-4 w-4" /> :
                   activity.type === 'quality' ? <CheckCircle2 className="h-4 w-4" /> :
                   <Truck className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Module Cards */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">ERP Modules</h2>
            <p className="text-muted-foreground">System modules and their status</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {modules.map((module) => (
            <Card key={module.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${module.color} rounded-lg`}>
                      <module.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={module.status === 'Active' ? 'default' : 'secondary'}>
                    {module.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Features:</p>
                  <ul className="space-y-1">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30">
                <Button variant="ghost" size="sm" className="w-full">
                  Open Module
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Partner Cards */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Partner Cards</h2>
            <p className="text-muted-foreground">Customer and supplier information cards</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {partners.map((partner) => (
            <Card key={partner.code}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {partner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{partner.code}</Badge>
                        <Badge variant="secondary">{partner.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.address}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 flex justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{partner.orders} Orders</span>
                </div>
                <Badge variant="default" className="bg-green-500">{partner.status}</Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Production Lines */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Factory className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Production Lines</h2>
            <p className="text-muted-foreground">Real-time production line monitoring</p>
          </div>
        </div>

        <div className="grid gap-4">
          {productionLines.map((line) => (
            <Card key={line.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      line.status === 'Running' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <Factory className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{line.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={line.status === 'Running' ? 'default' : 'destructive'}>
                          {line.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{line.output}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{line.efficiency}%</p>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                  </div>
                </div>
                {line.status === 'Running' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Efficiency</span>
                      <span className={line.efficiency >= 90 ? 'text-green-600' : 'text-yellow-600'}>
                        {line.efficiency >= 90 ? 'Good' : 'Average'}
                      </span>
                    </div>
                    <Progress 
                      value={line.efficiency} 
                      className={`h-2 ${
                        line.efficiency >= 90 ? '' : 
                        line.efficiency >= 70 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                      }`}
                    />
                  </div>
                )}
                {line.status === 'Maintenance' && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Scheduled maintenance in progress</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
