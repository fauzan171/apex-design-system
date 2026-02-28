import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const borderRadiusScale = [
  { name: 'none', value: '0px', className: 'rounded-none', usage: 'Tabel data', rounded: '' },
  { name: 'sm', value: '2px', className: 'rounded-sm', usage: 'Input fields', rounded: 'rounded-sm' },
  { name: 'md', value: '6px', className: 'rounded-md', usage: 'Buttons, badges', rounded: 'rounded-md' },
  { name: 'lg', value: '8px', className: 'rounded-lg', usage: 'Cards (default)', rounded: 'rounded-lg' },
  { name: 'xl', value: '12px', className: 'rounded-xl', usage: 'Modal, dialog', rounded: 'rounded-xl' },
  { name: 'full', value: '9999px', className: 'rounded-full', usage: 'Avatar, pills', rounded: 'rounded-full' },
];

export default function BorderRadiusPage() {
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
        <h1 className="text-3xl font-bold text-slate-800">Border Radius</h1>
        <p className="mt-2 text-slate-600">
          Sudut rounded untuk komponen UI agar konsisten di seluruh aplikasi ERP.
        </p>
      </div>

      {/* Border Radius Scale */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Border Radius Scale</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-200">
            {borderRadiusScale.map((radius) => (
              <div
                key={radius.name}
                className="p-6 flex items-center gap-6 hover:bg-slate-50 transition-colors"
              >
                {/* Visual representation */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 bg-[#006600] ${radius.rounded}`} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-slate-800">{radius.name}</p>
                    <span className="text-sm text-slate-500">{radius.value}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{radius.usage}</p>
                </div>

                {/* Class name */}
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-slate-100 px-3 py-1 rounded">{radius.className}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(radius.className)}
                    className="h-8 w-8"
                  >
                    {copied === radius.className ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contoh Penggunaan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* none */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-800 mb-3">rounded-none</p>
            <div className="bg-slate-100 rounded-none p-4">
              <table className="w-full text-sm">
                <tr className="border-b border-slate-200">
                  <td className="py-1">Data 1</td>
                  <td className="py-1">Value 1</td>
                </tr>
                <tr>
                  <td className="py-1">Data 2</td>
                  <td className="py-1">Value 2</td>
                </tr>
              </table>
            </div>
          </div>

          {/* sm */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-800 mb-3">rounded-sm</p>
            <input
              type="text"
              placeholder="Input field"
              className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm"
            />
          </div>

          {/* md */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-800 mb-3">rounded-md</p>
            <button className="px-4 py-2 bg-[#006600] text-white rounded-md text-sm">
              Button
            </button>
            <span className="ml-2 px-2 py-1 bg-orange-500 text-white rounded-md text-xs">
              Badge
            </span>
          </div>

          {/* lg */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-800 mb-3">rounded-lg</p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600">Card content</p>
            </div>
          </div>

          {/* xl */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-800 mb-3">rounded-xl</p>
            <div className="bg-slate-900 rounded-xl p-4">
              <p className="text-sm text-white">Modal / Dialog</p>
            </div>
          </div>

          {/* full */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-800 mb-3">rounded-full</p>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#006600] rounded-full flex items-center justify-center text-white font-medium">
                AF
              </div>
              <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs">
                Status
              </span>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
