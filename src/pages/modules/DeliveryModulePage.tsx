import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DeliveryModulePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Delivery Module</h1>
        <p className="mt-2 text-slate-600">
          Modul manajemen pengiriman dan tracking logistik.
        </p>
      </div>

      {/* Overview */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Overview</h2>
        <p className="text-slate-600 mb-4">
          Delivery module mengelola Delivery Order (DO), scheduling pengiriman, dan tracking status.
        </p>
      </section>

      {/* Components Used */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Komponen yang Digunakan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'DO Table', desc: 'Daftar delivery order', count: '1' },
            { name: 'Delivery Timeline', desc: 'Timeline pengiriman', count: '1' },
            { name: 'Map View', desc: 'Peta rute pengiriman', count: '1' },
            { name: 'Driver Assignment', desc: 'Penugasan driver', count: '1' },
            { name: 'Vehicle Selector', desc: 'Pilih kendaraan', count: '1' },
            { name: 'Route Planner', desc: 'Perencanaan rute', count: '1' },
            { name: 'Proof of Delivery', desc: 'Konfirmasi terima', count: '1' },
            { name: 'Tracking Status', desc: 'Status real-time', count: 'n' },
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

      {/* Delivery Status */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Status Pengiriman</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-slate-500">Preparing</Badge>
            <Badge className="bg-blue-500">Ready to Ship</Badge>
            <Badge className="bg-purple-500">In Transit</Badge>
            <Badge className="bg-yellow-500">Arrived</Badge>
            <Badge className="bg-[#006600]">Delivered</Badge>
            <Badge className="bg-red-500">Failed/Returned</Badge>
          </div>
        </div>
      </section>

      {/* Delivery Timeline Example */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contoh Delivery Timeline</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-semibold text-slate-800">DO-2024-0123</p>
                <p className="text-sm text-slate-500">PT. Konstruksi Maju Jaya</p>
              </div>
              <Badge className="bg-purple-500">In Transit</Badge>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                {[
                  { label: 'Preparing', time: '08:00', completed: true },
                  { label: 'Ready', time: '10:00', completed: true },
                  { label: 'In Transit', time: '10:30', completed: true },
                  { label: 'Arrived', time: '14:00', completed: false },
                  { label: 'Delivered', time: '', completed: false },
                ].map((step) => (
                  <div key={step.label} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-[#006600]' : 'bg-slate-300'
                    }`}>
                      {step.completed && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className={`text-xs mt-2 ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-500">{step.time}</p>
                  </div>
                ))}
              </div>
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-10" />
              <div className="absolute top-4 left-0 h-0.5 bg-[#006600] -z-10" style={{ width: '60%' }} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Today's Deliveries */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contoh Today's Deliveries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { doNumber: 'DO-2024-0123', customer: 'PT. Konstruksi Maju', items: 'Pintu Baja 90x210 (10)', status: 'In Transit', statusColor: 'bg-purple-500' },
            { doNumber: 'DO-2024-0124', customer: 'CV. Bangun Sejahtera', items: 'Kanopi C-100 (5)', status: 'Ready', statusColor: 'bg-blue-500' },
            { doNumber: 'DO-2024-0125', customer: 'UD. Rumah Aman', items: 'Rangka Atap (2)', status: 'Preparing', statusColor: 'bg-slate-500' },
            { doNumber: 'DO-2024-0126', customer: 'PT. Properti Indah', items: 'Tangga Putar (1)', status: 'Delivered', statusColor: 'bg-[#006600]' },
          ].map((delivery) => (
            <Card key={delivery.doNumber}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{delivery.doNumber}</p>
                    <p className="text-sm text-slate-500">{delivery.customer}</p>
                    <p className="text-xs text-slate-400 mt-1">{delivery.items}</p>
                  </div>
                  <Badge className={delivery.statusColor}>{delivery.status}</Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm">Detail</Button>
                  <Button variant="outline" size="sm">Track</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      
    </div>
  );
}
