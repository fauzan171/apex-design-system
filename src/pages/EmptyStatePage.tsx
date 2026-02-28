import { PackageOpen, FolderPlus, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmptyStatePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Empty State</h1>
        <p className="mt-2 text-slate-600">
          Tampilan saat tidak ada data yang tersedia untuk ditampilkan. Empty state krusial untuk mencegah kebingungan pengguna di dalam ERP.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Jenis-Jenis Empty State</h2>
        
        <div className="space-y-8">
          {/* First Use */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-medium text-slate-700">1. Baru Masuk Modul / Data Kosong Murni</div>
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="bg-green-50 p-4 rounded-full mb-4">
                <FolderPlus className="h-10 w-10 text-[#006600]" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Belum ada Purchase Order (PO)</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-6">Mulai jalankan sistem pengadaan Anda dengan membuat Purchase Order baru ke vendor terdaftar.</p>
              <Button>Buat PO Baru</Button>
            </div>
          </div>

          {/* Search/Filter Error */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-medium text-slate-700">2. Hasil Filter atau Pencarian Kosong</div>
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Inbox className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Pencarian Tidak Ditemukan</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-6">Kami tidak menemukan Material dengan keyword "Tembaga X7". Silakan coba keyword lainnya atau hapus filter tipe material.</p>
              <Button variant="outline">Hapus Filter</Button>
            </div>
          </div>
          
          {/* Missing Module Content */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-medium text-slate-700">3. Tab / Component Kosong (Micro Empty State)</div>
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <PackageOpen className="h-6 w-6 text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">Tidak ada riwayat harga log logistik.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Aturan Perakitan / Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Selalu sediakan "Call to Action" atau jalan keluar (misal: "Buat Item" / "Hapus Filter").</p>
            <p className="text-sm text-green-700 mt-2">Gunakan icon berukuran medium (h-8 ke h-10) berwarna netral pucat untuk memberikan impresi ringan.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Menulis "Data Error" padahal hanya "Tidak Memiliki Data". Ini menyebabkan kepanikan user (terutama baby boomer).</p>
          </div>
        </div>
      </section>

    </div>
  );
}
