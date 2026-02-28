import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

export default function AlertPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Alert</h1>
        <p className="mt-2 text-slate-600">
          Alert digunakan untuk menyampaikan pesan penting secara sinkronus agar mendapatkan perhatian penuh dari pengguna.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tujuan Penggunaan</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Memberitahu status sistem (error koneksi, maintenance).</li>
          <li>Menampikan warning spesifik pada form (misal: "Batas kredit vendor sudah hampir habis").</li>
          <li>Memandu pengguna untuk melengkapi data yang kurang.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Variants & States</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Informasi Default</AlertTitle>
            <AlertDescription>
              Update versi sistem ERP akan dilakukan malam ini pukul 23:00.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error System</AlertTitle>
            <AlertDescription>
              Koneksi ke server database Manufacture gagal. Silakan hubungi IT Support.
            </AlertDescription>
          </Alert>
          
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Tuliskan pesan yang ringkas dan "actionable" (jika error, beri tahu solusi/langkah selanjutnya).</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Menggunakan Alert untuk pesan sukses (gunakan Toast/Sonner/Snackbar sebagai ganti untuk yang tidak require aksi).</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spesifikasi Developer</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <ul className="space-y-2 text-sm">
            <li><strong>Component:</strong> <code>@/components/ui/alert</code></li>
            <li><strong>Icon size:</strong> <code>h-4 w-4</code></li>
            <li><strong>Default styling:</strong> <code>bg-background text-foreground</code></li>
            <li><strong>Destructive styling:</strong> <code>border-destructive/50 text-destructive dark:border-destructive</code></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
