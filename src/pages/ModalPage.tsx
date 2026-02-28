import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

export default function ModalPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Modal (Dialog)</h1>
        <p className="mt-2 text-slate-600">
          Modal (Dialog) digunakan untuk fokus pada satu tugas khusus atau memberikan informasi penting tanpa meninggalkan halaman saat ini.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tujuan Penggunaan</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Meminta konfirmasi pengguna sebelum melakukan tindakan destruktif (hapus data).</li>
          <li>Menampilkan form kompleks (contoh: tambah vendor baru).</li>
          <li>Menginformasikan status penting (sukses pembuatan PO).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Variants</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-wrap gap-4">
          
          {/* Default Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Default Modal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Data Vendor</DialogTitle>
                <DialogDescription>
                  Lakukan perubahan pada data vendor di bawah ini. Klik simpan jika sudah selesai.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-slate-500">Form content goes here...</p>
              </div>
              <DialogFooter>
                <Button variant="outline">Batal</Button>
                <Button>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Destructive Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Destructive Modal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <DialogTitle>Hapus Purchase Order?</DialogTitle>
                </div>
                <DialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Purchase Order PO-2023-001 akan dihapus permanen dari sistem.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button variant="outline">Batal</Button>
                <Button variant="destructive">Ya, Hapus</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Berikan judul modal yang jelas dan ringkas (contoh: "Hapus Pengguna?").</p>
            <p className="text-sm text-green-700 mt-2">Tombol aksi utama (Simpan/Hapus) harus diletakkan di sisi kanan bawah.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Membuka modal di dalam modal (nested modals). Ini akan membingungkan navigasi pengguna.</p>
            <p className="text-sm text-red-700 mt-2">Menyembunyikan informasi penting yang mengharuskan user scroll panjang di dalam modal.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spesifikasi Developer</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <ul className="space-y-2 text-sm">
            <li><strong>Component:</strong> <code>@/components/ui/dialog</code></li>
            <li><strong>Overlay:</strong> <code>bg-black/80</code></li>
            <li><strong>Radius Modal:</strong> <code>rounded-lg</code> (sama dengan border-radius global)</li>
            <li><strong>Padding Konten:</strong> <code>p-6</code></li>
            <li><strong>Shadow:</strong> <code>shadow-lg</code></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
