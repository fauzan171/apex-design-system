import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PurchasingModulePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Purchasing Module</h1>
        <p className="mt-2 text-slate-600">
          Modul pengadaan material dan manajemen supplier.
        </p>
      </div>

      {/* Overview */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Overview</h2>
        <p className="text-slate-600 mb-4">
          Purchasing module mengelola Purchase Order (PO), supplier, dan tracking pengadaan material.
        </p>
      </section>

      {/* Components Used */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Komponen yang Digunakan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'PO Table', desc: 'Daftar purchase order', count: '1' },
            { name: 'Supplier Card', desc: 'Info supplier', count: 'n' },
            { name: 'Material Selector', desc: 'Pilih material', count: '1' },
            { name: 'PO Form', desc: 'Form pembuatan PO', count: '1' },
            { name: 'Status Timeline', desc: 'Tracking status PO', count: '1' },
            { name: 'Attachment Upload', desc: 'Upload dokumen', count: '1' },
            { name: 'Approval Flow', desc: 'Alur approval', count: '1' },
            { name: 'Price Comparison', desc: 'Perbandingan harga', count: '1' },
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

      {/* PO Status */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Status Purchase Order</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-slate-500">Draft</Badge>
            <Badge className="bg-yellow-500">Pending Approval</Badge>
            <Badge className="bg-blue-500">Approved</Badge>
            <Badge className="bg-purple-500">Ordered</Badge>
            <Badge className="bg-orange-500">Partial Receive</Badge>
            <Badge className="bg-[#006600]">Completed</Badge>
            <Badge className="bg-red-500">Cancelled</Badge>
          </div>
        </div>
      </section>

      {/* Supplier Card Example */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contoh Supplier Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'PT. Baja Prima', category: 'Raw Material', rating: 5, orders: 45 },
            { name: 'CV. Logam Jaya', category: 'Component', rating: 4, orders: 23 },
            { name: 'UD. Besi Kuat', category: 'Raw Material', rating: 4, orders: 18 },
          ].map((supplier) => (
            <Card key={supplier.name}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{supplier.name}</p>
                    <p className="text-sm text-slate-500">{supplier.category}</p>
                  </div>
                  <Badge variant="outline">{supplier.rating}/5</Badge>
                </div>
                <p className="text-sm text-slate-600 mt-3">{supplier.orders} orders</p>
                <Button variant="outline" size="sm" className="mt-3 w-full">Lihat Detail</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      
    </div>
  );
}
