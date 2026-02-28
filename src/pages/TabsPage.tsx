import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TabsPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Tabs</h1>
        <p className="mt-2 text-slate-600">
          Tabs memisahkan konten ke dalam pandangan beralih tanpa meninggalkan halaman, mengelompokkan set data yang saling berkaitan.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tujuan Penggunaan</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Membagi formulir master data yang panjang menjadi beberapa bagian (Info Dasar, Alamat, Kontak, Rekening Bank).</li>
          <li>Menyediakan detail tambahan pada laporan tanpa menumpuk konten vertikal.</li>
          <li>Mengganti mode tampilan (List View vs Grid View - meski kadang toggle group lebih sesuai).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Variants</h2>
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 flex flex-col gap-8">
          
          <Tabs defaultValue="base" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="base">Data Dasar</TabsTrigger>
              <TabsTrigger value="history">Riwayat Harga</TabsTrigger>
            </TabsList>
            <TabsContent value="base">
              <Card>
                <CardHeader>
                  <CardTitle>Data Mutasi Material</CardTitle>
                  <CardDescription>
                    Informasi stok awal, masuk, keluar, dan saldo akhir bulan ini.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <p>Akses data pada bagian ini.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Perubahan Harga</CardTitle>
                  <CardDescription>
                    History harga beli dari berbagai supplier.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <p>Tidak ada perubahan harga terdeteksi.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Pastikan setidaknya satu tab selalu aktif di load pertama (default selected).</p>
            <p className="text-sm text-green-700 mt-2">Gunakan label tab yang konsisten dari segi jumlah kata (singkat, idealnya 1-2 kata).</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Melampaui 5-6 tab di desktop, atau 3-4 di mobile. Jika kebanyakan, pertimbangkan sidebar navigasi / accordion.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spesifikasi Developer</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <ul className="space-y-2 text-sm">
            <li><strong>Component:</strong> <code>@/components/ui/tabs</code></li>
            <li><strong>Background Kontainer Tab:</strong> <code>bg-muted text-muted-foreground</code></li>
            <li><strong>Active Tab:</strong> <code>bg-background text-foreground shadow-sm</code></li>
            <li><strong>Radius Kontainer:</strong> <code>rounded-md</code></li>
            <li><strong>Radius Item Active:</strong> Sama dengan radius komponen inner, biasanya <code>rounded-sm</code></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
