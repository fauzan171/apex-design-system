import { Type, Palette, LayoutGrid, Ruler } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const typeScale = [
  { name: 'Display XL', size: '48px', class: 'text-5xl font-bold', lineHeight: '1.1' },
  { name: 'Display LG', size: '36px', class: 'text-4xl font-bold', lineHeight: '1.2' },
  { name: 'Heading XL', size: '30px', class: 'text-3xl font-semibold', lineHeight: '1.2' },
  { name: 'Heading LG', size: '24px', class: 'text-2xl font-semibold', lineHeight: '1.3' },
  { name: 'Heading MD', size: '20px', class: 'text-xl font-semibold', lineHeight: '1.4' },
  { name: 'Heading SM', size: '18px', class: 'text-lg font-semibold', lineHeight: '1.4' },
  { name: 'Body Large', size: '18px', class: 'text-lg', lineHeight: '1.6' },
  { name: 'Body Medium', size: '16px', class: 'text-base', lineHeight: '1.6' },
  { name: 'Body Small', size: '14px', class: 'text-sm', lineHeight: '1.5' },
  { name: 'Caption', size: '12px', class: 'text-xs', lineHeight: '1.4' },
];

const colors = [
  { name: 'Primary', var: '--primary', hex: '#006600', description: 'Brand green - Main actions' },
  { name: 'Secondary', var: '--secondary', hex: '#F97316', description: 'Brand orange - Accent elements' },
  { name: 'Success', var: '--success', hex: '#16A34A', description: 'Positive states' },
  { name: 'Warning', var: '--warning', hex: '#EAB308', description: 'Caution states' },
  { name: 'Error', var: '--destructive', hex: '#DC2626', description: 'Error states' },
  { name: 'Info', var: '--info', hex: '#3B82F6', description: 'Information states' },
];

const neutralColors = [
  { name: 'Background', var: '--background', description: 'Page background' },
  { name: 'Foreground', var: '--foreground', description: 'Primary text' },
  { name: 'Card', var: '--card', description: 'Card backgrounds' },
  { name: 'Muted', var: '--muted', description: 'Muted backgrounds' },
  { name: 'Border', var: '--border', description: 'Borders and dividers' },
  { name: 'Input', var: '--input', description: 'Input fields' },
];

const spacing = [
  { name: 'xs', value: '4px', class: 'p-1' },
  { name: 'sm', value: '8px', class: 'p-2' },
  { name: 'md', value: '12px', class: 'p-3' },
  { name: 'lg', value: '16px', class: 'p-4' },
  { name: 'xl', value: '24px', class: 'p-6' },
  { name: '2xl', value: '32px', class: 'p-8' },
  { name: '3xl', value: '48px', class: 'p-12' },
  { name: '4xl', value: '64px', class: 'p-16' },
];

export default function FoundationsSection() {
  return (
    <div className="space-y-8">
      {/* Typography Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Type className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Typography</h2>
            <p className="text-muted-foreground">Font families: Inter (body), JetBrains Mono (code)</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Type Scale</CardTitle>
            <CardDescription>Consistent typography hierarchy for the ERP system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {typeScale.map((type) => (
              <div key={type.name} className="flex items-baseline gap-4">
                <div className="w-32 shrink-0">
                  <p className="text-sm font-medium text-muted-foreground">{type.name}</p>
                  <p className="text-xs text-muted-foreground/60">{type.size}</p>
                </div>
                <div className="flex-1">
                  <p className={type.class}>The quick brown fox</p>
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                  {type.class}
                </code>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Font Weights</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold'].map((weight) => (
              <div key={weight} className="p-4 border rounded-lg">
                <p className={`text-lg ${weight}`}>Aa</p>
                <code className="text-xs text-muted-foreground">{weight}</code>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Color Palette Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Color Palette</h2>
            <p className="text-muted-foreground">Brand colors with accessibility in mind</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Brand Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Apex Ferro primary brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {colors.slice(0, 2).map((color) => (
                <div key={color.name} className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-lg shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{color.name}</p>
                    <p className="text-sm text-muted-foreground">{color.description}</p>
                    <code className="text-xs text-muted-foreground">{color.hex}</code>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Semantic Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Semantic Colors</CardTitle>
              <CardDescription>Status and feedback colors</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {colors.slice(2).map((color) => (
                <div key={color.name} className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="text-sm font-medium">{color.name}</p>
                    <code className="text-xs text-muted-foreground">{color.hex}</code>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Neutral Colors */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Neutral Colors</CardTitle>
            <CardDescription>Grayscale palette for UI elements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {neutralColors.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div 
                    className="h-20 rounded-lg border shadow-sm"
                    style={{ backgroundColor: `hsl(var(${color.var}))` }}
                  />
                  <div>
                    <p className="text-sm font-medium">{color.name}</p>
                    <p className="text-xs text-muted-foreground">{color.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Spacing Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Ruler className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Spacing</h2>
            <p className="text-muted-foreground">Consistent spacing scale for layouts</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Spacing Scale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spacing.map((space) => (
              <div key={space.name} className="flex items-center gap-4">
                <div className="w-16 shrink-0">
                  <p className="text-sm font-medium">{space.name}</p>
                  <p className="text-xs text-muted-foreground">{space.value}</p>
                </div>
                <div className="flex-1 bg-muted rounded">
                  <div 
                    className="h-8 bg-primary/60 rounded"
                    style={{ width: space.value }}
                  />
                </div>
                <code className="text-xs text-muted-foreground w-20 text-right">{space.class}</code>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Border Radius Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LayoutGrid className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Border Radius</h2>
            <p className="text-muted-foreground">Corner radius for UI components</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6 items-end">
              {[
                { name: 'none', class: 'rounded-none', size: '0px' },
                { name: 'sm', class: 'rounded-sm', size: '2px' },
                { name: 'md', class: 'rounded-md', size: '6px' },
                { name: 'lg', class: 'rounded-lg', size: '8px' },
                { name: 'xl', class: 'rounded-xl', size: '12px' },
                { name: '2xl', class: 'rounded-2xl', size: '16px' },
                { name: 'full', class: 'rounded-full', size: '9999px' },
              ].map((radius) => (
                <div key={radius.name} className="text-center space-y-2">
                  <div className={`w-16 h-16 bg-primary/20 border-2 border-primary/40 ${radius.class}`} />
                  <div>
                    <p className="text-sm font-medium">{radius.name}</p>
                    <p className="text-xs text-muted-foreground">{radius.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
