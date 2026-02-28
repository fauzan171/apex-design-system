import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const productionData = [
  { name: 'Sen', produksi: 4000 },
  { name: 'Sel', produksi: 3000 },
  { name: 'Rab', produksi: 2000 },
  { name: 'Kam', produksi: 2780 },
  { name: 'Jum', produksi: 1890 },
  { name: 'Sab', produksi: 2390 },
  { name: 'Min', produksi: 3490 },
];

const orderStatusData = [
  { name: 'Pending', value: 400 },
  { name: 'In Progress', value: 300 },
  { name: 'Completed', value: 300 },
];
const COLORS = ['#F59E0B', '#3B82F6', '#10B981'];

export default function DashboardModulePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Module</h1>
        <p className="mt-2 text-slate-600">
          Halaman utama ERP untuk melihat ringkasan data dan chart helicopter view.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Overview</h2>
        <p className="text-slate-600 mb-4">
          Dashboard menampilkan KPI utama, chart produksi, status order, dan notifikasi penting.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Komponen yang Digunakan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Stats Card', desc: 'Menampilkan KPI utama', count: '4-6' },
            { name: 'Line Chart', desc: 'Trend produksi harian', count: '1-2' },
            { name: 'Bar Chart', desc: 'Perbandingan data bulanan', count: '1-2' },
            { name: 'Pie Chart', desc: 'Distribusi status order', count: '1' },
            { name: 'Progress Bar', desc: 'Target vs pencapaian', count: '2-4' },
            { name: 'Alert Banner', desc: 'Notifikasi penting', count: '1-3' },
            { name: 'Quick Actions', desc: 'Shortcut ke modul lain', count: '4-6' },
            { name: 'Recent Activity', desc: 'Log aktivitas terbaru', count: '1' },
          ].map((comp) => (
            <Card key={comp.name}>
              <CardContent className="p-4">
                <p className="font-semibold text-slate-800">{comp.name}</p>
                <p className="text-sm text-slate-500 mt-1">{comp.desc}</p>
                <Badge variant="outline" className="mt-2">{comp.count} items</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contoh Stats Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">Total Produksi</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">1,234</p>
              <p className="text-sm text-green-600 mt-1">+12% dari bulan lalu</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">Order Aktif</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">56</p>
              <p className="text-sm text-orange-500 mt-1">8 perlu perhatian</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">Stok Material</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">89%</p>
              <p className="text-sm text-green-600 mt-1">Level aman</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">Pengiriman Hari Ini</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">12</p>
              <p className="text-sm text-blue-500 mt-1">3 dalam proses</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contoh Chart Area Lengkap</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-slate-800">Trend Produksi Mingguan (Line Chart)</CardTitle>
              <p className="text-sm text-slate-500">Gunakan untuk memonitor data berkesinambungan seperti tren produksi atau pergerakan harga.</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                    <Line type="monotone" dataKey="produksi" name="Volume Produksi" stroke="#006600" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base text-slate-800">Performa Gudang (Bar Chart)</CardTitle>
              <p className="text-sm text-slate-500">Gunakan untuk komparasi angka tunggal antar entitas yang berbeda pada suatu waktu.</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                    <Bar dataKey="produksi" name="Pengiriman (Unit)" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base text-slate-800">Distribusi Status Order (Pie Chart)</CardTitle>
              <p className="text-sm text-slate-500">Gunakan khusus untuk melihat proporsi penyebaran status dari 100% total data, misalnya status order.</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="h-64 w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderStatusData.map((_, i) => (
                          <Cell key={"cell-" + i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-4">
                  {orderStatusData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-sm font-medium text-slate-700">{entry.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap gap-3">
            <Button className="bg-[#006600] hover:bg-[#005500]">Buat Order Baru</Button>
            <Button variant="outline">Input Produksi</Button>
            <Button variant="outline">Cek Stok</Button>
            <Button variant="outline">Laporan Harian</Button>
          </div>
        </div>
      </section>

    </div>
  );
}
