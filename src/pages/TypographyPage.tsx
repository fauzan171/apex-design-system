import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const typeScale = [
  { name: 'Display XL', size: '48px', className: 'text-5xl font-bold', example: 'Judul Dashboard', usage: 'Judul halaman utama dashboard' },
  { name: 'Display LG', size: '36px', className: 'text-4xl font-bold', example: 'Section Header', usage: 'Header section penting' },
  { name: 'Heading XL', size: '30px', className: 'text-3xl font-semibold', example: 'Modul ERP', usage: 'Judul modul ERP' },
  { name: 'Heading LG', size: '24px', className: 'text-2xl font-semibold', example: 'Sub-judul Halaman', usage: 'Sub-judul halaman' },
  { name: 'Heading MD', size: '20px', className: 'text-xl font-semibold', example: 'Judul Card', usage: 'Judul card/komponen' },
  { name: 'Heading SM', size: '18px', className: 'text-lg font-semibold', example: 'Label Grup', usage: 'Label grup data' },
  { name: 'Body Large', size: '18px', className: 'text-lg', example: 'Deskripsi penting untuk pengguna', usage: 'Deskripsi penting' },
  { name: 'Body Medium', size: '16px', className: 'text-base', example: 'Teks utama aplikasi ERP untuk kebutuhan sehari-hari', usage: 'Teks utama aplikasi' },
  { name: 'Body Small', size: '14px', className: 'text-sm', example: 'Label dan keterangan tambahan', usage: 'Label, keterangan' },
  { name: 'Caption', size: '12px', className: 'text-xs', example: 'Terakhir diperbarui 2 jam lalu', usage: 'Timestamp, metadata' },
];

const fontFamilies = [
  {
    name: 'Inter',
    usage: 'Teks utama, elemen UI',
    className: 'font-sans',
    sample: 'Pintu Baja Premium dengan kualitas terbaik untuk rumah Anda. 0123456789',
  },
  {
    name: 'JetBrains Mono',
    usage: 'Kode, data monospace',
    className: 'font-mono',
    sample: 'PRD-001 | Rp 2.500.000 | Qty: 100',
  },
];

export default function TypographyPage() {
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
        <h1 className="text-3xl font-bold text-slate-800">Typography</h1>
        <p className="mt-2 text-slate-600">
          Sistem tipografi untuk konsistensi tampilan teks di seluruh aplikasi ERP Apex Ferro.
        </p>
      </div>

      {/* Font Families */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Font Families</h2>
        <p className="text-slate-600 mb-4">
          Font: Inter untuk teks, JetBrains Mono untuk kode dan data.
        </p>
        <div className="grid gap-4">
          {fontFamilies.map((font) => (
            <div
              key={font.name}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">{font.name}</h3>
                  <p className="text-sm text-slate-500">{font.usage}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(font.className)}
                  className="gap-1"
                >
                  {copied === font.className ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {font.className}
                </Button>
              </div>
              <p className={`text-2xl ${font.className}`}>
                {font.sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Type Scale */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Type Scale</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-200">
            {typeScale.map((type) => (
              <div
                key={type.name}
                className="p-6 flex items-start justify-between gap-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className={type.className}>{type.example}</p>
                  <p className="text-sm text-slate-500 mt-1">{type.usage}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-medium text-slate-800">{type.name}</p>
                    <p className="text-sm text-slate-500">{type.size}</p>
                    <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{type.className}</code>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(type.className)}
                    className="h-8 w-8"
                  >
                    {copied === type.className ? (
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

      {/* Text Colors */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Text Colors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Primary', className: 'text-slate-800', desc: 'Teks utama' },
            { name: 'Secondary', className: 'text-slate-600', desc: 'Teks sekunder' },
            { name: 'Muted', className: 'text-slate-400', desc: 'Teks disabled/hint' },
            { name: 'Accent', className: 'text-[#006600]', desc: 'Teks highlight' },
            { name: 'Success', className: 'text-green-600', desc: 'Pesan sukses' },
            { name: 'Error', className: 'text-red-600', desc: 'Pesan error' },
          ].map((color) => (
            <div
              key={color.name}
              className="bg-white rounded-xl border border-slate-200 p-4"
            >
              <p className={`text-lg font-semibold ${color.className}`}>{color.name}</p>
              <p className="text-sm text-slate-500 mt-1">{color.desc}</p>
              <p className="text-xs font-mono text-slate-400 mt-2">{color.className}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
