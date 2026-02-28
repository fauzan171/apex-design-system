import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TrendingUp, TrendingDown, Users, DollarSign, Package, Bell } from 'lucide-react';

export default function CardsPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Card</h1>
        <p className="mt-2 text-slate-600">
          Card adalah penampung serbaguna untuk mengisolasi potongan informasi saling berkaitan agar mudah diproses secara visual.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tujuan Penggunaan</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Dashboard Metrics (KPI, ringkasan jumlah pendapatan/pesanan).</li>
          <li>Mengelompokkan sections dalam form besar (contoh: Card "Informasi Penagihan", Card "Alamat Pengiriman").</li>
          <li>Library Card View (jika tidak menggunakan struktur tabel).</li>
        </ul>
      </section>

      {/* Stats Cards */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Stats & Metrics Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Revenue', value: 'Rp 450M', change: '+12%', icon: DollarSign, trend: 'up' },
            { title: 'Total Orders', value: '1,234', change: '+5%', icon: Package, trend: 'up' },
            { title: 'Active Vendors', value: '85', change: '-2%', icon: Users, trend: 'down' },
            { title: 'Pending Approval', value: '12', change: 'Urgent', icon: Bell, trend: 'neutral' },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full \${
                    stat.trend === 'up' ? 'bg-green-100 text-green-600' :
                    stat.trend === 'down' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {stat.trend !== 'neutral' ? (
                    <>
                      {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500 mr-1" /> : <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
                      <span className={stat.trend === 'up' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {stat.change}
                      </span>
                      <span className="text-slate-500 ml-1">dari bulan lalu</span>
                    </>
                  ) : (
                    <span className="text-amber-600 font-medium flex items-center">
                      Membutuhkan aksi
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Content Cards */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Content Form Grouping</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pengiriman</CardTitle>
              <CardDescription>Atur alamat gudang tujuan pengiriman untuk Purchase Order ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Gudang Penerima</div>
                  <div className="text-sm text-slate-600 p-2 bg-slate-50 rounded border">Gudang Utama A (Jawa Barat)</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Tanggal Ekspektasi Tiba</div>
                  <div className="text-sm text-slate-600 p-2 bg-slate-50 rounded border">12 Agustus 2024</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t rounded-b-xl py-4 flex justify-end gap-2">
              <Button variant="outline">Ubah Alamat</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vendor Terpilih</CardTitle>
                <CardDescription>Data terekam otomatis dari Master Data.</CardDescription>
              </div>
              <Badge>Verified Partner</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarFallback className="bg-[#006600]/10 text-[#006600] font-bold">PT</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-slate-800">PT Sinar Berlian Manufaktur</h4>
                  <p className="text-sm text-slate-500">Contact: Bapak Budi (Sales Manager)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Untuk form panjang berantai, pisahkan logical chunk (Info Produk, Specs, Pricing) ke dalam beberapa Card yang ditumpuk menurun.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Menumpuk Card di dalam Card (Nested Cards) tanpa gaya outline/background yang berbeda, bisa membuat pengguna pusing dengan shadow berlebih.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spesifikasi Developer</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <ul className="space-y-2 text-sm">
            <li><strong>Component:</strong> <code>@/components/ui/card</code></li>
            <li><strong>Background default:</strong> <code>bg-card text-card-foreground</code></li>
            <li><strong>Border:</strong> Selalu tampilkan border tipis standard <code>border border-border</code> pada card dashboard/content.</li>
            <li><strong>Padding:</strong> Header default dan content <code>p-6</code> (bawaan shadcn).</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
