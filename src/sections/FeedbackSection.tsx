import { Bell, AlertTriangle, CheckCircle, Info, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const alertVariants = [
  {
    variant: 'default' as const,
    icon: Info,
    title: 'Information',
    description: 'This is an informational message for the user.',
  },
  {
    variant: 'destructive' as const,
    icon: XCircle,
    title: 'Error',
    description: 'Something went wrong. Please try again.',
  },
];

export default function FeedbackSection() {
  return (
    <div className="space-y-8">
      {/* Alerts Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Alerts</h2>
            <p className="text-muted-foreground">Alert components for user feedback</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alert Components</CardTitle>
            <CardDescription>Different alert styles for various contexts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertVariants.map((alert) => (
              <Alert key={alert.variant} variant={alert.variant}>
                <alert.icon className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
            {/* Success Alert (custom style) */}
            <Alert className="border-green-500 bg-green-50 text-green-900">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Success</AlertTitle>
              <AlertDescription className="text-green-800">
                Your changes have been saved successfully.
              </AlertDescription>
            </Alert>
            {/* Warning Alert (custom style) */}
            <Alert className="border-yellow-500 bg-yellow-50 text-yellow-900">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-900">Warning</AlertTitle>
              <AlertDescription className="text-yellow-800">
                Please review this information before proceeding.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Toast Notifications */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Toast Notifications</h2>
            <p className="text-muted-foreground">Temporary notifications that appear and disappear</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Toast Examples</CardTitle>
            <CardDescription>Click buttons to see toast notifications</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button 
              onClick={() => toast.success('Success!', { description: 'Your action was completed successfully.' })}
              variant="default"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Success Toast
            </Button>
            <Button 
              onClick={() => toast.error('Error!', { description: 'Something went wrong. Please try again.' })}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Error Toast
            </Button>
            <Button 
              onClick={() => toast.warning('Warning!', { description: 'Please review before proceeding.' })}
              variant="secondary"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Warning Toast
            </Button>
            <Button 
              onClick={() => toast.info('Information', { description: 'Here is some useful information.' })}
              variant="outline"
            >
              <Info className="h-4 w-4 mr-2" />
              Info Toast
            </Button>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Loading States */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Loader2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Loading States</h2>
            <p className="text-muted-foreground">Indicators for loading and processing states</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Spinners */}
          <Card>
            <CardHeader>
              <CardTitle>Spinners</CardTitle>
              <CardDescription>Loading spinners in different sizes</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </CardContent>
          </Card>

          {/* Progress Bars */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Bars</CardTitle>
              <CardDescription>Linear progress indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span className="text-muted-foreground">25%</span>
                </div>
                <Progress value={25} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing</span>
                  <span className="text-muted-foreground">60%</span>
                </div>
                <Progress value={60} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Complete</span>
                  <span className="text-muted-foreground">100%</span>
                </div>
                <Progress value={100} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skeleton Loaders */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Skeleton Loaders</CardTitle>
            <CardDescription>Placeholder loading states for content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Skeleton */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground mb-3">Text Skeleton</p>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>

            <Separator />

            {/* Card Skeleton */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground mb-3">Card Skeleton</p>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Table Skeleton */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground mb-3">Table Skeleton</p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
