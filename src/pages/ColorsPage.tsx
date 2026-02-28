import { useState } from 'react';

const primaryColors = [
  { name: 'Primary Green', hex: '#006600', desc: 'Tombol utama, navigasi aktif, status OK', className: 'bg-[#006600]' },
];

const secondaryColors = [
  { name: 'Secondary Orange', hex: '#F97316', desc: 'Tombol aksen, badge warning, highlight', className: 'bg-orange-500' },
];

const semanticColors = [
  { name: 'Success', hex: '#16A34A', desc: 'Order selesai, QC passed, stok aman', className: 'bg-green-600' },
  { name: 'Warning', hex: '#EAB308', desc: 'Stok menipis, maintenance due, perhatian', className: 'bg-yellow-500' },
  { name: 'Error', hex: '#DC2626', desc: 'Order gagal, QC failed, error sistem', className: 'bg-red-600' },
  { name: 'Info', hex: '#3B82F6', desc: 'Notifikasi, informasi umum, help', className: 'bg-blue-500' },
];

const neutralColors = [
  { name: 'Background', hex: '#FFFFFF', desc: 'Latar belakang utama', className: 'bg-white border border-slate-200' },
  { name: 'Foreground', hex: '#0F172A', desc: 'Teks utama', className: 'bg-slate-900' },
  { name: 'Muted', hex: '#64748B', desc: 'Teks sekunder, placeholder', className: 'bg-slate-500' },
  { name: 'Border', hex: '#E2E8F0', desc: 'Border, divider', className: 'bg-slate-200' },
  { name: 'Input', hex: '#F8FAFC', desc: 'Background input field', className: 'bg-slate-50 border border-slate-200' },
  { name: 'Card', hex: '#FFFFFF', desc: 'Background card', className: 'bg-white border border-slate-200' },
];

export default function ColorsPage() {
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
        <h1 className="text-3xl font-bold text-slate-800">Color Palette</h1>
        <p className="mt-2 text-slate-600">
          Warna brand dan semantic colors untuk aplikasi ERP Apex Ferro.
        </p>
      </div>

      {/* Primary Color */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Primary Color</h2>
        <p className="text-slate-600 mb-4">
          Warna hijau utama merepresentasikan pertumbuhan, stabilitas, dan kepercayaan.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {primaryColors.map((color) => (
            <div key={color.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => copyToClipboard(color.hex)}
                className={`w-full h-32 ${color.className} transition-opacity hover:opacity-90 flex items-center justify-center`}
              >
                <span className="text-white font-bold text-lg">{copied === color.hex ? 'Copied!' : color.hex}</span>
              </button>
              <div className="p-4">
                <p className="font-semibold text-slate-800">{color.name}</p>
                <p className="text-sm text-slate-500 mt-1">{color.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Secondary Color */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Secondary Color</h2>
        <p className="text-slate-600 mb-4">
          Oranye sebagai warna aksen untuk menarik perhatian pada elemen penting.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {secondaryColors.map((color) => (
            <div key={color.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => copyToClipboard(color.hex)}
                className={`w-full h-32 ${color.className} transition-opacity hover:opacity-90 flex items-center justify-center`}
              >
                <span className="text-white font-bold text-lg">{copied === color.hex ? 'Copied!' : color.hex}</span>
              </button>
              <div className="p-4">
                <p className="font-semibold text-slate-800">{color.name}</p>
                <p className="text-sm text-slate-500 mt-1">{color.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Semantic Colors</h2>
        <p className="text-slate-600 mb-4">
          Warna untuk komunikasi status dan makna kepada pengguna.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {semanticColors.map((color) => (
            <div key={color.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => copyToClipboard(color.hex)}
                className={`w-full h-24 ${color.className} transition-opacity hover:opacity-90 flex items-center justify-center`}
              >
                <span className="text-white font-medium">{copied === color.hex ? 'Copied!' : color.hex}</span>
              </button>
              <div className="p-4">
                <p className="font-semibold text-slate-800">{color.name}</p>
                <p className="text-xs text-slate-500 mt-1">{color.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Neutral Colors */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Neutral Colors</h2>
        <p className="text-slate-600 mb-4">
          Warna netral untuk background, teks, border, dan elemen UI umum.
        </p>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-200">
            {neutralColors.map((color) => (
              <button
                key={color.name}
                onClick={() => copyToClipboard(color.hex)}
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`w-16 h-16 rounded-lg ${color.className} shadow-sm flex-shrink-0`}
                />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-slate-800">{color.name}</p>
                  <p className="text-sm text-slate-500">{color.desc}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-slate-600">{color.hex}</p>
                  {copied === color.hex && (
                    <p className="text-xs text-green-600">Copied!</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Panduan Penggunaan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-3">Lakukan</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Gunakan Primary Green untuk tombol utama dan CTA
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Pastikan kontras warna memenuhi standar aksesibilitas
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Gunakan semantic colors secara konsisten sesuai konteksnya
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Secondary Orange untuk highlight dan aksen
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-3">Jangan Lakukan</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Jangan gunakan terlalu banyak warna dalam satu tampilan
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Jangan gunakan semantic colors di luar tujuannya
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Jangan membuat warna baru di luar palet yang ada
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Jangan gunakan warna dengan kontras rendah untuk teks penting
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
