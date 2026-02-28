import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function PaginationPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Pagination</h1>
        <p className="mt-2 text-slate-600">
          Pagination membagi kumpulan data besar menjadi beberapa halaman terpisah.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tujuan Penggunaan</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Diutamakan pada tabel data (master data, daftar PO/SO) agar load halaman tetap ringan.</li>
          <li>Katalog item (misal: Material Library) berbentuk cards/grid.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Variants</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col gap-8 items-start">
          
          {/* Standard Pagination */}
          <div className="w-full">
            <h3 className="text-sm font-medium text-slate-500 mb-4">Tabel Panjang dengan Ellipsis</h3>
            <Pagination className="justify-start">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    10
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Dalam ERP, berikan kombinasi pemilihan "Rows per page" (10, 20, 50, 100) bersama pagination.</p>
            <p className="text-sm text-green-700 mt-2">Non-aktifkan (disable) tombol "Previous" saat berada di halaman 1.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Me-load seluruh data dari backend sekaligus; pastikan pagination dilakukan via API backend untuk dataset jutaan baris.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spesifikasi Developer</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <ul className="space-y-2 text-sm">
            <li><strong>Component:</strong> <code>@/components/ui/pagination</code></li>
            <li><strong>State Aktif:</strong> Menggunakan modifikasi prop <code>isActive</code> yang mengatur border <code>border-primary text-primary</code> (warna hijau / #006600).</li>
            <li><strong>Size Tombol Area:</strong> Minimal padukan dengan standar button klik area, <code>h-9 w-9</code>.</li>
            <li><strong>Event:</strong> Tambahkan event onClick standar pada tombol pagination sesuai parameter router/state.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
