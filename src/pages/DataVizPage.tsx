import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon 
} from 'lucide-react';
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
  Legend,
  ResponsiveContainer
} from 'recharts';

const lineData = [
  { name: 'Sen', produksi: 4000, target: 2400 },
  { name: 'Sel', produksi: 3000, target: 1398 },
  { name: 'Rab', produksi: 2000, target: 9800 },
  { name: 'Kam', produksi: 2780, target: 3908 },
  { name: 'Jum', produksi: 1890, target: 4800 },
  { name: 'Sab', produksi: 2390, target: 3800 },
  { name: 'Min', produksi: 3490, target: 4300 },
];

const barData = [
  { name: 'Raw Material', stok: 4000 },
  { name: 'Work in Progress', stok: 3000 },
  { name: 'Finished Goods', stok: 2000 },
  { name: 'Packaging', stok: 2780 },
];

const pieData = [
  { name: 'Selesai', value: 400 },
  { name: 'Diproses', value: 300 },
  { name: 'Tertunda', value: 300 },
  { name: 'Dibatalkan', value: 200 },
];
const COLORS = ['#006600', '#3B82F6', '#F59E0B', '#EF4444'];

export default function DataVizPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Data Visualization</h1>
        <p className="mt-2 text-slate-600">
          Panduan tentang cara menyajikan data analitik, statistik dashboard, dan laporan grafikal di dalam Apex Ferro ERP menggunakan <code>recharts</code>.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Prinsip Warna pada Chart</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Warna digunakan semata untuk diferensiasi series / data, bukan sebagai ornamen. Hindari menggunakan terlalu banyak warna jika tidak diperlukan.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#006600]" />
              <span className="text-xs text-slate-500 mt-2">Primary Series</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#009900]" />
              <span className="text-xs text-slate-500 mt-2">Secondary</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#33b233]" />
              <span className="text-xs text-slate-500 mt-2">Tertiary</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <span className="text-xs text-slate-500 mt-2">Background Data</span>
            </div>
            <div className="flex items-center ml-8 border-l pl-8 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-red-500" />
                <span className="text-xs text-slate-500 mt-2">Negatif/Penurunan</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500" />
                <span className="text-xs text-slate-500 mt-2">Positif Netral</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Implementasi Chart Aktual</h2>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Line Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <LineChartIcon className="h-6 w-6 text-slate-400" />
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Line Chart</h3>
                <p className="text-xs text-slate-500">Gunakan untuk memantau fluktuasi data secara berkelanjutan vs waktu (Time-Series).</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Studi Kasus ERP: Memantau riwayat Harga Pokok Produksi material baja selama 6 bulan terakhir.</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="produksi" name="Aktual Produksi" stroke="#006600" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="target" name="Target Plan" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Bar Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <BarChartIcon className="h-6 w-6 text-slate-400" />
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Bar/Column Chart</h3>
                <p className="text-xs text-slate-500">Gunakan untuk membandingkan besaran antar entitas/kategori yang terpisah dan tidak kontinyu.</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Studi Kasus ERP: Membandingkan total Delivery Order dari 5 Gudang (Warehouse) utama di Indonesia.</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                  <Tooltip 
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="stok" name="Jumlah Stok Fisik" fill="#006600" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Pie Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <PieChartIcon className="h-6 w-6 text-slate-400" />
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Pie/Donut Chart</h3>
                <p className="text-xs text-slate-500">Menganalisa komposisi proporsi / persentase dari sebuah "Whole" atau keseluruhan data set.</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Studi Kasus ERP: Breakdown status 50.000 Purchase Order (Berapa % Pending, % Completed, % Canceled).</p>
              </div>
            </div>
            <div className="flex items-center justify-center h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={"cell-" + i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Pastikan Y-Axis responsif jika data terlalu lebar (ribuan hingga jutaan). Format angka tooltip menjadi satuan yang mudah dibaca (Misal 1.000.000 menjadi 1M).</p>
            <p className="text-sm text-green-700 mt-2">Selalu pasang `Tooltip` agar detail nilai presisi poin statistik masih terlihat ketika di highlight kursor/hover.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Memulai skala Y-Axis dari base point yang bukan Nol (0) untuk visualisasi perbandingan Bar Chart karena ilusi visual grafik menjadi membingungkan.</p>
            <p className="text-sm text-red-700 mt-2">Menggunakan Pie-Chart lebih dari 5 irisan warna.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
