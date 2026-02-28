import { Navigation, ChevronRight, Home, Settings, Users, FileText, Factory } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const breadcrumbExamples = [
  {
    title: 'Simple Breadcrumb',
    items: [
      { label: 'Home', href: '#', icon: Home },
      { label: 'Products', href: '#' },
      { label: 'Steel Beams', current: true },
    ],
  },
  {
    title: 'Multi-level Breadcrumb',
    items: [
      { label: 'Home', href: '#', icon: Home },
      { label: 'Production', href: '#' },
      { label: 'Orders', href: '#' },
      { label: 'PO-002', current: true },
    ],
  },
];

const menuItems = [
  { label: 'Dashboard', icon: Home, href: '#' },
  { label: 'Production', icon: Factory, href: '#', active: true },
  { label: 'Inventory', icon: FileText, href: '#' },
  { label: 'Employees', icon: Users, href: '#' },
  { label: 'Settings', icon: Settings, href: '#' },
];

export default function NavigationSection() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Navigation className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Breadcrumb</h2>
            <p className="text-muted-foreground">Navigation path indicators</p>
          </div>
        </div>

        <div className="grid gap-6">
          {breadcrumbExamples.map((example, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{example.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Breadcrumb>
                  <BreadcrumbList>
                    {example.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center">
                        {itemIndex > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                          {item.current ? (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={item.href} className="flex items-center gap-1">
                              {item.icon && <item.icon className="h-3.5 w-3.5" />}
                              {item.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </div>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Pagination Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Navigation className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Pagination</h2>
            <p className="text-muted-foreground">Page navigation controls</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Pagination */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Pagination</CardTitle>
            </CardHeader>
            <CardContent>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>

          {/* Pagination with Info */}
          <Card>
            <CardHeader>
              <CardTitle>With Results Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Showing <span className="font-medium text-foreground">21</span> to{' '}
                  <span className="font-medium text-foreground">30</span> of{' '}
                  <span className="font-medium text-foreground">95</span> results
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">4</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">10</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Menu Navigation */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Navigation className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Menu Navigation</h2>
            <p className="text-muted-foreground">Sidebar and navigation menu patterns</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Vertical Menu */}
          <Card>
            <CardHeader>
              <CardTitle>Vertical Menu</CardTitle>
              <CardDescription>Sidebar navigation pattern</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      item.active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Horizontal Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Horizontal Tabs</CardTitle>
              <CardDescription>Tab-based navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1 border-b">
                {menuItems.slice(0, 4).map((item, index) => (
                  <button
                    key={item.label}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      index === 1
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Tab content area</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Button Group Navigation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Button Group</CardTitle>
            <CardDescription>Segmented control pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm">Daily</Button>
              <Button variant="outline" size="sm">Weekly</Button>
              <Button variant="outline" size="sm">Monthly</Button>
              <Button variant="outline" size="sm">Yearly</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="default" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">...</Button>
              <Button variant="outline" size="sm">10</Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
