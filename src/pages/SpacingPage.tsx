import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const spacingScale = [
  { name: 'xs', value: '4px', className: 'p-1', usage: 'Gap icon dan teks', width: 'w-1' },
  { name: 'sm', value: '8px', className: 'p-2', usage: 'Padding button small', width: 'w-2' },
  { name: 'md', value: '12px', className: 'p-3', usage: 'Padding input field', width: 'w-3' },
  { name: 'lg', value: '16px', className: 'p-4', usage: 'Padding card default', width: 'w-4' },
  { name: 'xl', value: '24px', className: 'p-6', usage: 'Section padding', width: 'w-6' },
  { name: '2xl', value: '32px', className: 'p-8', usage: 'Page padding', width: 'w-8' },
];

export default function SpacingPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Spacing</h1>
        <p className="mt-2 text-slate-600">
          Jarak antar elemen UI untuk konsistensi layout di seluruh aplikasi ERP.
        </p>
      </div>

      {/* Spacing Scale */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Spacing Scale</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-200">
            {spacingScale.map((spacing) => (
              <div
                key={spacing.name}
                className="p-6 flex items-center gap-6 hover:bg-slate-50 transition-colors"
              >
                {/* Visual representation */}
                <div className="flex-shrink-0 w-32">
                  <div className="flex items-center gap-2">
                    <div className={`bg-[#006600] ${spacing.width} h-4 rounded-sm`} />
                    <span className="text-sm text-slate-500">{spacing.value}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-slate-800">{spacing.name}</p>
                    <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{spacing.className}</code>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{spacing.usage}</p>
                </div>

                {/* Copy button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(spacing.className)}
                  className="h-8 w-8"
                >
                  {copied === spacing.className ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contoh Penggunaan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-3">Gap antar elemen</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-slate-200 rounded" />
                <div className="w-8 h-8 bg-slate-200 rounded" />
                <span className="text-sm text-slate-500 ml-2">gap-1 (xs - 4px)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-200 rounded" />
                <div className="w-8 h-8 bg-slate-200 rounded" />
                <span className="text-sm text-slate-500 ml-2">gap-2 (sm - 8px)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-slate-200 rounded" />
                <div className="w-8 h-8 bg-slate-200 rounded" />
                <span className="text-sm text-slate-500 ml-2">gap-4 (lg - 16px)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-3">Padding komponen</h3>
            <div className="space-y-3">
              <div className="bg-slate-100 p-1 rounded inline-block">
                <div className="bg-white px-2 py-1 text-sm">p-1</div>
              </div>
              <div className="bg-slate-100 p-2 rounded inline-block">
                <div className="bg-white px-2 py-1 text-sm">p-2</div>
              </div>
              <div className="bg-slate-100 p-4 rounded inline-block">
                <div className="bg-white px-2 py-1 text-sm">p-4</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
