import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingStatePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Loading State</h1>
        <p className="mt-2 text-slate-600">
          Panduan tentang strategi memuat data agar mengurangi persepsi waktu tunggu dan menenangkan sistem pengguna.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Skeleton vs Spinner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Tipe: Skeleton Loader</h3>
            <p className="text-sm text-slate-600 mb-6">
              Gunakan saat memuat kerangka halaman (halaman detail material) atau tabel di mana layout sudah bisa ditebak oleh user.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-[100px] w-full rounded-lg" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Tipe: Inline Spinner</h3>
            <p className="text-sm text-slate-600 mb-6">
              Gunakan untuk micro-interactions (tombol sedang menyimpan) atau bagian kecil yang tiba-tiba direfresh.
            </p>
            <div className="flex items-center justify-center p-8 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-[#006600]" />
                <span className="text-sm text-slate-500 font-medium">Sedang memproses...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Button Loading State</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Ini wajib diterapkan. Saat pengguna mengklik `Submit`, tombol harus di-disable preventif dan menampilkan indikator loading untuk mencegah form dikirim dua kali <i>(double submit prevention)</i>.
          </p>
          <div className="flex gap-4">
            <button disabled className="bg-[#006600]/70 cursor-not-allowed text-white px-4 py-2 rounded-md font-medium text-sm flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Menyimpan Data...
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Dalam tabel besar, gunakan skeleton row per baris ketimbang spinner raksasa di tengah layar untuk memberi indikasi isi tabel lebih baik.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Menggunakan Overlay Blocking (full background hitam transparan + spinner besar) kecuali pada proses finansial ekstrem atau transaksi posting Ledger.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
