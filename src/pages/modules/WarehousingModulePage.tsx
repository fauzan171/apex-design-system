import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function WarehousingModulePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Warehousing Module</h1>
        <p className="mt-2 text-slate-600">
          Modul manajemen gudang dan inventori material.
        </p>
      </div>

      {/* Overview */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Overview</h2>
        <p className="text-slate-600 mb-4">
          Warehousing module mengelola stok material, lokasi penyimpanan, dan pergerakan inventori.
        </p>
      </section>

      {/* Components Used */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Komponen yang Digunakan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Inventory Table', desc: 'Daftar stok material', count: '1' },
            { name: 'Stock Card', desc: 'Info stok item', count: 'n' },
            { name: 'Location Tree', desc: 'Struktur lokasi gudang', count: '1' },
            { name: 'Stock Movement', desc: 'Riwayat pergerakan', count: '1' },
            { name: 'Low Stock Alert', desc: 'Alert stok menipis', count: '1' },
            { name: 'Barcode Scanner', desc: 'Input barcode', count: '1' },
            { name: 'Stock Adjustment', desc: 'Penyesuaian stok', count: '1' },
            { name: 'Bin Location', desc: 'Lokasi rak/slot', count: 'n' },
          ].map((comp) => (
            <Card key={comp.name}>
              <CardContent className="p-4">
                <p className="font-semibold text-slate-800">{comp.name}</p>
                <p className="text-sm text-slate-500 mt-1">{comp.desc}</p>
                <Badge variant="outline" className="mt-2">{comp.count}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stock Status */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Status Stok</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-[#006600]">Tersedia</Badge>
            <Badge className="bg-yellow-500">Stok Menipis</Badge>
            <Badge className="bg-red-500">Stok Habis</Badge>
            <Badge className="bg-blue-500">Dalam Pengiriman</Badge>
            <Badge className="bg-purple-500">Reserved</Badge>
          </div>
        </div>
      </section>

      {/* Stock Cards Example */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contoh Stock Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Baja Ringan 0.5mm', stock: 150, unit: 'Lembar', status: 'Tersedia', statusColor: 'bg-[#006600]' },
            { name: 'Pintu Baja 90x210', stock: 25, unit: 'Unit', status: 'Stok Menipis', statusColor: 'bg-yellow-500' },
            { name: 'Cat Besi Anti Karat', stock: 0, unit: 'Pail', status: 'Stok Habis', statusColor: 'bg-red-500' },
          ].map((item) => (
            <Card key={item.name}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <Badge className={`mt-2 ${item.statusColor}`}>{item.status}</Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-slate-800">{item.stock}</p>
                  <p className="text-sm text-slate-500">{item.unit}</p>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">Detail Stok</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Low Stock Alert */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Low Stock Alert</h2>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">!</span>
              </div>
              <div>
                <p className="font-semibold text-yellow-800">3 item dengan stok menipis</p>
                <p className="text-sm text-yellow-600">Segera lakukan restock untuk menghindari kekurangan material</p>
              </div>
              <Button size="sm" className="ml-auto bg-yellow-500 hover:bg-yellow-600">Lihat Detail</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      
    </div>
  );
}
