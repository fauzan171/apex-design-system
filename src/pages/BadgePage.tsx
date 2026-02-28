import { Badge } from '@/components/ui/badge';

export default function BadgePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Badge</h1>
        <p className="mt-2 text-slate-600">
          Badge berfungsi sebagai penanda visual kecil untuk mengindikasikan status, jumlah, atau kategori suatu entitas.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tujuan Penggunaan</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Menampilkan status dokumen (Draft, Pending, Approved, Rejected).</li>
          <li>Menunjukkan jumlah notifikasi pesan baru.</li>
          <li>Kategorisasi jenis material di modul Inventory (Raw, WIP, Finished Good).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Variants</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-wrap items-center gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          
          {/* Custom implementation for generic statuses like Success/Warning */}
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Success</Badge>
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Warning</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Pilih warna secara semantik. Hijau untuk Approved, Merah untuk Rejected, Kuning untuk Pending, Abu-abu untuk Draft.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Tidak menjadikan badge sebagai elemen interaktif yang clickable (kecuali untuk fitur filter tags, tapi utamakan checkbox/toggle untuk form filter).</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spesifikasi Developer</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <ul className="space-y-2 text-sm">
            <li><strong>Component:</strong> <code>@/components/ui/badge</code></li>
            <li><strong>Padding:</strong> <code>px-2.5 py-0.5</code></li>
            <li><strong>Font Size:</strong> <code>text-xs font-semibold</code></li>
            <li><strong>Radius:</strong> <code>rounded-full</code> (default) atau <code>rounded-md</code> (untuk kategori panjang).</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
