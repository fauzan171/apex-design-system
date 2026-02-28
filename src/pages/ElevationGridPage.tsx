export default function ElevationGridPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Elevation & Grid</h1>
        <p className="mt-2 text-slate-600">
          Panduan tentang penggunaan bayangan (shadow) untuk menunjukkan hirarki dan sistem grid untuk layout layout responsif.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Elevation (Shadows)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
            <span className="font-medium text-slate-800">Level 1 (Card/Panel)</span>
            <code className="text-xs text-slate-500 bg-slate-50 p-2 border rounded">shadow-sm</code>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md flex flex-col justify-between h-32">
            <span className="font-medium text-slate-800">Level 2 (Dropdown/Popover)</span>
            <code className="text-xs text-slate-500 bg-slate-50 p-2 border rounded">shadow-md</code>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg flex flex-col justify-between h-32 relative z-10">
            <span className="font-medium text-slate-800">Level 3 (Modal/Dialog)</span>
            <code className="text-xs text-slate-500 bg-slate-50 p-2 border rounded">shadow-lg</code>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Grid System</h2>
        <p className="mb-4 text-slate-600">
          Sistem ERP Apex Ferro menggunakan grid 12-kolom dengan gap yang konsisten.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-[#006600]/10 border border-[#006600]/20 h-12 rounded flex items-center justify-center text-[#006600] text-xs font-semibold">
                1
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 bg-[#006600]/10 border border-[#006600]/20 h-12 rounded flex items-center justify-center text-[#006600] text-xs font-semibold">8</div>
            <div className="col-span-4 bg-[#006600]/10 border border-[#006600]/20 h-12 rounded flex items-center justify-center text-[#006600] text-xs font-semibold">4</div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 bg-[#006600]/10 border border-[#006600]/20 h-12 rounded flex items-center justify-center text-[#006600] text-xs font-semibold">6</div>
            <div className="col-span-6 bg-[#006600]/10 border border-[#006600]/20 h-12 rounded flex items-center justify-center text-[#006600] text-xs font-semibold">6</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Gunakan elevation level 3 (lg) pada modal untuk memperjelas elevasi konten teratas.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Menggunakan drop shadow berwarna nyentrik atau level blur yang terlalu besar untuk sebuah card biasa.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
