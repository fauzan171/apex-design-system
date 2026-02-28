import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProductionModulePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Production Module</h1>
        <p className="mt-2 text-slate-600">
          Modul manajemen proses produksi dan quality control.
        </p>
      </div>

      {/* Overview */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Overview</h2>
        <p className="text-slate-600 mb-4">
          Production module mengelola work order, tracking produksi, dan quality control (QC).
        </p>
      </section>

      {/* Components Used */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Komponen yang Digunakan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Work Order Table', desc: 'Daftar work order', count: '1' },
            { name: 'Production Kanban', desc: 'Board visual produksi', count: '1' },
            { name: 'Progress Tracker', desc: 'Progress produksi', count: 'n' },
            { name: 'QC Checklist', desc: 'Checklist quality', count: '1' },
            { name: 'Defect Log', desc: 'Log cacat produksi', count: '1' },
            { name: 'Machine Status', desc: 'Status mesin', count: 'n' },
            { name: 'Worker Assignment', desc: 'Penugasan pekerja', count: '1' },
            { name: 'Batch Tracking', desc: 'Tracking batch', count: '1' },
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

      {/* Production Status */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Status Produksi</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-slate-500">Waiting</Badge>
            <Badge className="bg-blue-500">In Progress</Badge>
            <Badge className="bg-purple-500">QC Check</Badge>
            <Badge className="bg-yellow-500">Rework</Badge>
            <Badge className="bg-[#006600]">Completed</Badge>
            <Badge className="bg-red-500">Rejected</Badge>
          </div>
        </div>
      </section>

      {/* Kanban Board Example */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contoh Kanban Board</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Waiting', items: ['WO-001', 'WO-002'], color: 'bg-slate-500' },
            { title: 'In Progress', items: ['WO-003', 'WO-004', 'WO-005'], color: 'bg-blue-500' },
            { title: 'QC Check', items: ['WO-006'], color: 'bg-purple-500' },
            { title: 'Completed', items: ['WO-007', 'WO-008'], color: 'bg-[#006600]' },
          ].map((column) => (
            <Card key={column.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{column.title}</CardTitle>
                  <Badge className={column.color}>{column.items.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {column.items.map((item) => (
                  <div key={item} className="p-3 bg-slate-50 rounded-lg text-sm">
                    <p className="font-medium text-slate-800">{item}</p>
                    <p className="text-xs text-slate-500 mt-1">Pintu Baja 90x210</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Progress Tracker */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contoh Progress Tracker</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-slate-800">WO-003: Pintu Baja 90x210</p>
                <p className="text-sm text-slate-500">Qty: 50 unit | Target: 28 Feb 2024</p>
              </div>
              <Badge className="bg-blue-500">In Progress</Badge>
            </div>
            <div className="space-y-4">
              {[
                { step: 'Cutting', progress: 100, status: 'completed' },
                { step: 'Welding', progress: 80, status: 'active' },
                { step: 'Finishing', progress: 0, status: 'pending' },
                { step: 'QC Check', progress: 0, status: 'pending' },
              ].map((step) => (
                <div key={step.step}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`text-slate-600 ${step.status === 'completed' ? 'text-green-600' : ''}`}>
                      {step.step}
                    </span>
                    <span className="text-slate-500">{step.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        step.status === 'completed' ? 'bg-[#006600]' :
                        step.status === 'active' ? 'bg-blue-500' : 'bg-slate-300'
                      }`}
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      
    </div>
  );
}
