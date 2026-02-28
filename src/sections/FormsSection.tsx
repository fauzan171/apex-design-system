import { MousePointer, Plus, Search, Trash2, UserPlus, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const buttonVariants = [
  { variant: 'default' as const, label: 'Default' },
  { variant: 'secondary' as const, label: 'Secondary' },
  { variant: 'outline' as const, label: 'Outline' },
  { variant: 'ghost' as const, label: 'Ghost' },
  { variant: 'destructive' as const, label: 'Destructive' },
];

const buttonSizes = [
  { size: 'sm' as const, label: 'Small' },
  { size: 'default' as const, label: 'Default' },
  { size: 'lg' as const, label: 'Large' },
];

const badgeVariants = [
  { variant: 'default' as const, label: 'Default' },
  { variant: 'secondary' as const, label: 'Secondary' },
  { variant: 'outline' as const, label: 'Outline' },
  { variant: 'destructive' as const, label: 'Destructive' },
];

const statusBadges = [
  { label: 'Active', color: 'bg-green-500', textColor: 'text-white' },
  { label: 'Inactive', color: 'bg-gray-400', textColor: 'text-white' },
  { label: 'Pending', color: 'bg-yellow-500', textColor: 'text-white' },
  { label: 'Error', color: 'bg-red-500', textColor: 'text-white' },
];

export default function FormsSection() {
  return (
    <div className="space-y-8">
      {/* Buttons Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MousePointer className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Buttons</h2>
            <p className="text-muted-foreground">Touch targets are minimum 44px (h-11) for accessibility</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Button Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Different button styles for various actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {buttonVariants.map((btn) => (
                  <Button key={btn.variant} variant={btn.variant}>
                    {btn.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Button Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Button Sizes</CardTitle>
              <CardDescription>Available button sizes</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end gap-3">
              {buttonSizes.map((btn) => (
                <Button key={btn.size} size={btn.size}>
                  {btn.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Buttons with Icons */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>With Icons</CardTitle>
            <CardDescription>Buttons with leading and trailing icons</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
            <Button variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Item
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Loading States */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button disabled>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Loading...
            </Button>
            <Button variant="secondary" disabled>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing
            </Button>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Badges Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Check className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Badges</h2>
            <p className="text-muted-foreground">Status indicators and labels</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Badge Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>Basic badge styles</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {badgeVariants.map((badge) => (
                <Badge key={badge.variant} variant={badge.variant}>
                  {badge.label}
                </Badge>
              ))}
            </CardContent>
          </Card>

          {/* Status Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Status Badges</CardTitle>
              <CardDescription>Badges with status indicators</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {statusBadges.map((badge) => (
                <Badge key={badge.label} className={`${badge.color} ${badge.textColor} gap-1`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {badge.label}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Form Components Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MousePointer className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Form Components</h2>
            <p className="text-muted-foreground">Input elements for data entry</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Text Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Text Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default">Default Input</Label>
                <Input id="default" placeholder="Enter text..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="with-icon">With Icon</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="with-icon" className="pl-10" placeholder="Search..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled">Disabled</Label>
                <Input id="disabled" disabled placeholder="Disabled input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="error">Error State</Label>
                <Input id="error" className="border-destructive" placeholder="Error input" />
                <p className="text-sm text-destructive">This field has an error</p>
              </div>
            </CardContent>
          </Card>

          {/* Textarea */}
          <Card>
            <CardHeader>
              <CardTitle>Textarea</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="textarea">Description</Label>
                <Textarea id="textarea" placeholder="Enter description..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="textarea-disabled">Disabled</Label>
                <Textarea id="textarea-disabled" disabled placeholder="Disabled textarea" rows={3} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Select & Dropdown */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Select Dropdown</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Default Select</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>With Groups</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prod">Production</SelectItem>
                  <SelectItem value="inv">Inventory</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Disabled</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Disabled" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Checkboxes & Radios */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Checkbox</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="newsletter" defaultChecked />
                <Label htmlFor="newsletter">Subscribe to newsletter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="disabled" disabled />
                <Label htmlFor="disabled" className="text-muted-foreground">Disabled checkbox</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Radio Group</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="option1" className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="option1" />
                  <Label htmlFor="option1">Production Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="option2" />
                  <Label htmlFor="option2">Maintenance Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option3" id="option3" />
                  <Label htmlFor="option3">Testing Mode</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Switches */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Switches</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch id="airplane" />
              <Label htmlFor="airplane">Airplane Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notifications" defaultChecked />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="dark-mode" />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="disabled-switch" disabled />
              <Label htmlFor="disabled-switch" className="text-muted-foreground">Disabled</Label>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
