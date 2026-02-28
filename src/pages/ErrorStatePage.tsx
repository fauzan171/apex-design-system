import { AlertTriangle, WifiOff, ServerCrash } from 'lucide-react';

export default function ErrorStatePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Error State</h1>
        <p className="mt-2 text-slate-600">
          Panduan tentang bagaimana menampilkan informasi kesalahan ke pengguna agar mereka mengerti apa yang terjadi dan bagaimana memperbaikinya.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Prinsip Pesan Error yang Baik</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <ul className="list-disc list-inside space-y-2 text-slate-700">
            <li><strong>Jelas & Ringkas:</strong> Hindari istilah terlalu teknis ("NullReferenceException"). Ganti dengan bahasa sederhana ("Data vendor gagal dimuat").</li>
            <li><strong>Berikan Solusi:</strong> Selalu beri tahu tindakan yang bisa diambil pengguna ("Coba muat ulang" atau "Hubungi administrator").</li>
            <li><strong>Tepat Penempatan:</strong> Tampilkan di dekat elemen yang bermasalah. (Contoh: error kolom isian tampil persis di bawah input).</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Level Error di ERP</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold flex items-center text-red-700 mb-2">
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs mr-2 border border-red-200">System Level</span> 
              Global / Server Crash
            </h3>
            <p className="text-sm text-slate-600 mb-4">Error kritis ketika seluruh halaman gagal merender atau backend lumpuh. Gunakan Full-page Error / Fallback Page.</p>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-red-200 bg-red-50 p-8 rounded-lg">
              <ServerCrash className="h-10 w-10 text-red-500 mb-4" />
              <p className="font-bold text-slate-800">Sistem sedang bermasalah</p>
              <p className="text-sm text-slate-500 text-center max-w-sm mt-1">Kami tidak dapat terhubung ke server produksi. Silakan coba kembali dalam beberapa saat.</p>
              <button className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded text-sm font-medium hover:bg-slate-50">Muat Ulang Halaman</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold flex items-center text-amber-700 mb-2">
              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs mr-2 border border-amber-200">Component Level</span> 
              Gagal Memuat Sebagian Data
            </h3>
            <p className="text-sm text-slate-600 mb-4">Contoh: Hanya tabel Riwayat Stok yang gagal dimuat, tapi data master berhasil. Gunakan Card Error Message (Atau Alert Component).</p>
            <div className="flex flex-col items-center justify-center p-8 border border-slate-200 rounded-lg bg-slate-50">
              <WifiOff className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700">Data tabel gagal diambil</p>
              <button className="mt-2 text-sm text-[#006600] font-semibold underline">Coba Lagi</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold flex items-center text-red-600 mb-2">
              <span className="bg-red-50 border border-red-100 px-2 py-1 rounded text-xs mr-2">Field Level</span> 
              Validasi Form (Input Error)
            </h3>
            <p className="text-sm text-slate-600 mb-4">Tampilkan text merah kecil tepat di bawah kolom input, dan gariskan input dengan border merah.</p>
            <div className="max-w-xs">
              <label className="text-sm font-medium text-slate-700">Jumlah Pesanan</label>
              <input type="text" className="w-full mt-1 px-3 py-2 border-red-500 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" value="Seratus" readOnly />
              <p className="text-xs text-red-500 mt-1 flex items-center"><AlertTriangle className="h-3 w-3 mr-1"/> Jumlah pesanan harus berupa angka</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
