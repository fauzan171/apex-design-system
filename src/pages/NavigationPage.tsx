
export default function NavigationPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Navigation (Sidebar & Topbar)</h1>
        <p className="mt-2 text-slate-600">
          Struktur navigasi utama untuk memandu pengguna berkeliling sistem ERP.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Sidebar (Navigasi Kiri)</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <p className="text-slate-600">
            Sidebar digunakan sebagai navigasi menu utama antar modul atau sub-modul (contoh: dari menu Dashboard ke Planning, atau ke menu Settings).
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 mt-2">
            <li><strong>Desktop:</strong> Tampil konstan (fixed) di sisi kiri layer layar. Lebar standar sekitar <code>240-260px</code> (w-64).</li>
            <li><strong>State:</strong> Dapat diperkecil (collapsed) menjadi icon saja untuk memberi ruang lebih besar pada tabel.</li>
            <li><strong>Kategorisasi:</strong> Gunakan judul kecil (uppercase text-xs) untuk membagi menu berdasarkan kategori grup fitur.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Topbar (Navigasi Atas)</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <p className="text-slate-600">
            Topbar digunakan untuk konteks global halaman saat ini (breadcrumb), pencarian global, notifikasi, dan profil pengguna.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 mt-2">
            <li><strong>Tinggi:</strong> Minimal <code>h-14</code> atau <code>h-16</code>.</li>
            <li><strong>Aksi Global:</strong> Ikon Lonceng untuk notifikasi sistem ERP.</li>
            <li><strong>Profil Dropdown:</strong> Menu untuk logout, role switch, atau ke pengaturan akun.</li>
            <li><strong>Mobile:</strong> Menjadi rumah sementara untuk tombol hamburger (Menu Toggle) pembuka sidebar.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Gunakan icon yang deskriptif dan familiar di sebelah nama menu di Sidebar (misal: Ikon Factory untuk modul Produksi).</p>
            <p className="text-sm text-green-700 mt-2">Berikan state aktif yang sangat kontras jika sedang berada di elemen tersebut (background tipis + font bold).</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Nested menu pada sidebar yang terlalu dalam (lebih dari 2 level dropdown internal). Usahakan flatter hierarchy.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
