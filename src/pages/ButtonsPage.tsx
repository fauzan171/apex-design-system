import { ArrowRight, Loader2, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ButtonsPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Button</h1>
        <p className="mt-2 text-slate-600">
          Tombol digunakan untuk mengeksekusi aksi utama, memicu form submit, atau menavigasi proses dalam ERP.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tujuan Penggunaan & Variants</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b pb-6">
            <div className="space-y-2">
              <Button>Primary Button</Button>
              <p className="text-sm font-bold text-slate-800">Tujuan: Aksi paling utama di halaman.</p>
              <p className="text-xs text-slate-500">Contoh: "Simpan Transaksi", "Buat PO Baru". Hanya boleh ada 1 per section/view.</p>
            </div>
            <div className="space-y-2">
              <Button variant="secondary">Secondary Button</Button>
              <p className="text-sm font-bold text-slate-800">Tujuan: Alternatif sekunder.</p>
              <p className="text-xs text-slate-500">Contoh: "Simpan sebagai Draft", "Filter Pencarian".</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b pb-6">
            <div className="space-y-2">
              <Button variant="outline">Outline Button</Button>
              <p className="text-sm font-bold text-slate-800">Tujuan: Aksi mundur atau non-kritis.</p>
              <p className="text-xs text-slate-500">Contoh: "Batal", "Tutup Modal".</p>
            </div>
            <div className="space-y-2">
              <Button variant="destructive">Destructive Button</Button>
              <p className="text-sm font-bold text-slate-800">Tujuan: Menghapus data permanen.</p>
              <p className="text-xs text-slate-500">Peringatan: Selalu memicu Modal konfirmasi dulu sebelum dieksekusi.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-2">
              <Button variant="ghost">Ghost Button</Button>
              <p className="text-sm font-bold text-slate-800">Tujuan: Icon tab, navigasi minor.</p>
              <p className="text-xs text-slate-500">Digunakan agar tidak menumpuk layer visual dengan primary/secondary button.</p>
            </div>
            <div className="space-y-2">
              <Button variant="link">Link Button</Button>
              <p className="text-sm font-bold text-slate-800">Tujuan: Teks dapat diklik tanpa styling tombol penuh.</p>
              <p className="text-xs text-slate-500">Contoh: Lupa password, "Coba Lagi".</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">States (Perilaku Tombol)</h2>
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl flex flex-wrap gap-6">
          <div className="space-y-2 flex-1 min-w-[150px]">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Default</span>
            <div><Button>Simpan Data</Button></div>
          </div>
          <div className="space-y-2 flex-1 min-w-[150px]">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hover / Focus</span>
            <div><Button className="bg-[#006600]/90 ring-2 ring-offset-2 ring-[#006600]">Simpan Data</Button></div>
          </div>
          <div className="space-y-2 flex-1 min-w-[150px]">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disabled</span>
            <div><Button disabled>Simpan Data</Button></div>
          </div>
          <div className="space-y-2 flex-1 min-w-[150px]">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading</span>
            <div>
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Sizing & Icon Placement</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-8 gap-4 flex flex-wrap items-center">
          <Button size="sm">Small Form (sm)</Button>
          <Button size="default">Default Form</Button>
          <Button size="lg">Large Hero/Login (lg)</Button>
          
          <div className="w-1 px-4 text-slate-300">|</div>

          <Button>
            <Plus className="mr-2 h-4 w-4" /> Leading Icon
          </Button>
          <Button variant="outline">
            Trailing Icon <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" title="Cari Data">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Gunakan kata kerja aktif dan padat untuk label tombol (e.g., "Kirim", "Simpan", "Hapus"). Maksimal 3 kata.</p>
            <p className="text-sm text-green-700 mt-2">Ubah text menjadi "Menyimpan..." atau beri Loader ketika tombol diklik agar user tahu proses sedang berjalan.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Meletakkan lebih dari satu Primary Button berwarna solid hijau dalam satu Card/Section. Prioritaskan satu aksi utama saja.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spesifikasi Developer</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <ul className="space-y-2 text-sm">
            <li><strong>Component:</strong> <code>@/components/ui/button</code></li>
            <li><strong>Padding X/Y:</strong> Default (<code>px-4 py-2</code>), Small (<code>px-3 text-xs</code>).</li>
            <li><strong>Focus Visible:</strong> Memiliki <code>focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2</code> untuk aksesibilitas keyboard (WAJIB).</li>
            <li><strong>Disabled State:</strong> Memberikan class <code>disabled:pointer-events-none disabled:opacity-50</code>.</li>
          </ul>
        </div>
      </section>

    </div>
  );
}
