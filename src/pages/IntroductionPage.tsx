export default function IntroductionPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Apex Ferro Design System</h1>
        <p className="mt-4 text-lg text-slate-600">
          Sistem desain ini dirancang khusus untuk ERP Manufaktur Apex Ferro. Dibangun dengan fokus pada efisiensi, kejelasan visual, dan konsistensi untuk target pengguna staf administrasi (Baby Boomers & Milenial).
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Design Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">1. Clarity Over Decoration</h3>
            <p className="text-sm text-slate-600">Hindari elemen visual yang tidak memiliki fungsi. Fungsionalitas ERP mengutamakan keterbacaan data dan hirarki informasi yang jelas.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">2. Efficient Data Entry</h3>
            <p className="text-sm text-slate-600">Form input, tabel, dan aksi utama harus dapat diakses dengan cepat, mendukung navigasi keyboard, dan memiliki indikator error yang jelas.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">3. Predictable Patterns</h3>
            <p className="text-sm text-slate-600">Pola UI harus konsisten di seluruh modul (Purchasing, Planning, Warehouse, dll) agar user tidak perlu beradaptasi ulang saat berpindah modul.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">4. Accessible & Forgiving</h3>
            <p className="text-sm text-slate-600">Menggunakan kontras yang memadai dan memberikan feedback yang jelas pada setiap aksi pengguna (sukses, error, loading).</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Untuk Frontend Developer</h2>
        <div className="bg-slate-900 rounded-xl p-6 text-slate-300 space-y-4">
          <p>
            Desain sistem ini menggunakan <strong>Tailwind CSS</strong> dan komponen berbasis <strong>shadcn/ui</strong>. 
            Dokumentasi ini menyediakan spesifikasi (tokens) yang harus digunakan untuk menjaga konsistensi.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Selalu gunakan token yang disediakan (contoh: <code>bg-slate-50</code>, <code>text-[#006600]</code>).</li>
            <li>Perhatikan state komponen (hover, focus, disabled, loading).</li>
            <li>Gunakan komponen standar untuk elemen umum (Button, Table, Input).</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
