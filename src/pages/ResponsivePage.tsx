import { Smartphone, Monitor } from 'lucide-react';

export default function ResponsivePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Responsive Behavior</h1>
        <p className="mt-2 text-slate-600">
          Panduan tentang beradaptasi dengan berbagai ukuran layar. Meski ERP sering diakses via desktop, beberapa flow seperti Approval Level diskenariokan untuk tablet/mobile admin.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Breakpoints Utama</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <ul className="space-y-4 text-sm font-mono">
            <li>
              <span className="text-blue-400">sm:</span> <code>&gt;= 640px</code> <span className="text-slate-500">/* Tablet Portrait */</span>
            </li>
            <li>
              <span className="text-purple-400">md:</span> <code>&gt;= 768px</code> <span className="text-slate-500">/* Tablet Landscape */</span>
            </li>
            <li>
              <span className="text-green-400">lg:</span> <code>&gt;= 1024px</code> <span className="text-slate-500">/* Desktop Kecil / Minimal Requirement ERP */</span>
            </li>
            <li>
              <span className="text-yellow-400">xl:</span> <code>&gt;= 1280px</code> <span className="text-slate-500">/* Native Desktop */</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Perilaku Elemen</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold flex items-center text-slate-800 mb-2">
              <Monitor className="h-5 w-5 mr-2 text-slate-400" /> Desktop First tapi Adaptive
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Kita merancang ERP dengan fokus utama Desktop (Desktop-First). Tapi kita harus menjamin navigasi mobile tidak rusak parah. Di mobile, sidebar menjadi drawer hamburger, dan Data Table dapat di-scroll secara horizontal, bukan di-squeeze memanjang vertikal.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 mb-4">Layout Form (Desktop)</h3>
              <div className="flex gap-4 border border-dashed border-slate-400 p-4 rounded bg-slate-50">
                <div className="w-1/2 p-2 bg-slate-200 rounded text-center text-xs text-slate-500">Input 1</div>
                <div className="w-1/2 p-2 bg-slate-200 rounded text-center text-xs text-slate-500">Input 2</div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Smartphone className="h-4 w-4 mr-2" /> Layout Form (Mobile)</h3>
              <div className="flex flex-col gap-4 border border-dashed border-slate-400 p-4 rounded bg-slate-50">
                <div className="w-full p-2 bg-slate-200 rounded text-center text-xs text-slate-500">Input 1</div>
                <div className="w-full p-2 bg-slate-200 rounded text-center text-xs text-slate-500">Input 2</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Terapkan class <code>overflow-x-auto</code> pada setiap table wrapper agar tabel tidak menghancurkan layout ketika layar ditutup menjadi kecil sempit.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Menyembunyikan informasi kritikal seperti total harga atau actions di mobile (hanya sembunyikan kolom tersunder seperti "Dibuat Pada").</p>
          </div>
        </div>
      </section>

    </div>
  );
}
