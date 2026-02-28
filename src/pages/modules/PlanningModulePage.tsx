import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PlanningModulePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Planning Module</h1>
        <p className="mt-2 text-slate-600">
          Modul perencanaan produksi dan penjadwalan manufacturing.
        </p>
      </div>

      {/* Overview */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Overview</h2>
        <p className="text-slate-600 mb-4">
          Planning module digunakan untuk membuat rencana produksi, jadwal kerja, dan alokasi sumber daya.
        </p>
      </section>

      {/* Components Used */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Komponen yang Digunakan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Gantt Chart', desc: 'Timeline jadwal produksi', count: '1' },
            { name: 'Calendar', desc: 'Penjadwalan visual', count: '1' },
            { name: 'Planning Table', desc: 'Daftar rencana produksi', count: '1' },
            { name: 'Resource Allocation', desc: 'Alokasi mesin & SDM', count: '1' },
            { name: 'Capacity Bar', desc: 'Kapasitas produksi', count: '2-4' },
            { name: 'Date Picker', desc: 'Filter periode', count: '2' },
            { name: 'Status Badge', desc: 'Status rencana', count: 'n' },
            { name: 'Action Buttons', desc: 'CRUD operations', count: '3-4' },
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

      {/* Planning Status Example */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Status Planning</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-slate-500">Draft</Badge>
            <Badge className="bg-yellow-500">Review</Badge>
            <Badge className="bg-blue-500">Approved</Badge>
            <Badge className="bg-[#006600]">In Progress</Badge>
            <Badge className="bg-green-600">Completed</Badge>
            <Badge className="bg-red-500">Cancelled</Badge>
          </div>
        </div>
      </section>

      {/* Capacity Overview */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contoh Capacity Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kapasitas Mesin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Mesin Cutting', capacity: 85, status: 'Optimal' },
                { name: 'Mesin Welding', capacity: 95, status: 'Penuh' },
                { name: 'Mesin Finishing', capacity: 60, status: 'Tersedia' },
              ].map((machine) => (
                <div key={machine.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{machine.name}</span>
                    <span className={`font-medium ${machine.capacity >= 90 ? 'text-orange-500' : 'text-green-600'}`}>
                      {machine.capacity}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${machine.capacity >= 90 ? 'bg-orange-500' : 'bg-[#006600]'}`}
                      style={{ width: `${machine.capacity}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Jadwal Minggu Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-slate-400">Calendar / Gantt View</p>
                  <p className="text-xs text-slate-400 mt-1">Visual jadwal produksi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      
    </div>
  );
}
