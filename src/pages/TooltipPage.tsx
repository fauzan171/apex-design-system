import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle, Trash, Edit, Mail } from 'lucide-react';

export default function TooltipPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Tooltip</h1>
        <p className="mt-2 text-slate-600">
          Tooltip memberikan penjelasan singkat tentang elemen yang sedang di-hover, focus, atau disentuh tanpa memenuhi desain standar.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tujuan Penggunaan</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Pada tombol aksi icon-only di tabel (seperti tombol edit/hapus).</li>
          <li>Pada sebuah label / teks input yang memiliki konvensi khusus (contoh icon tanda tanya sebelah label field "SLA").</li>
          <li>Pada icon status yang padat.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Variants</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-wrap gap-8 items-center">
          
          <TooltipProvider>
            
            <div className="flex gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hapus Dokumen</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Data Vendor</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Kirim Notifikasi Peringatan via Email</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Batas Waktu Tunggu (SLA)</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px]">
                  <p className="text-xs">SLA (Service Level Agreement) maksimum vendor merespon pesanan dalam hari kerja (bukan hari kalender).</p>
                </TooltipContent>
              </Tooltip>
            </div>

          </TooltipProvider>

        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Gunakan bahasa yang sederhana. Hindari paragraf panjang di dalam tooltip.</p>
            <p className="text-sm text-green-700 mt-2">Bungkus seluruh aplikasi dengan `TooltipProvider` satu kali saja di layer root.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Menggunakan tooltip untuk menaruh informasi krusial yang harusnya selalu terlihat oleh user.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spesifikasi Developer</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <ul className="space-y-2 text-sm">
            <li><strong>Component:</strong> <code>@/components/ui/tooltip</code></li>
            <li><strong>Background:</strong> <code>bg-popover text-popover-foreground</code> atau sebaliknya (hitam solid: <code>bg-slate-900 text-slate-50</code>).</li>
            <li><strong>Padding:</strong> <code>px-3 py-1.5</code></li>
            <li><strong>Font Size:</strong> <code>text-xs</code> atau <code>text-sm</code></li>
            <li><strong>Animasi Delay:</strong> Dianjurkan menggunakan default shadcn (delay 0.2s - 0.5s setelah cursor hover).</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
