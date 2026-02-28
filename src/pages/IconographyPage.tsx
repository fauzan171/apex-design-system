import { 
  Type, Palette, Square, List, ToggleLeft, FileText, Menu, X, Space, 
  Circle, LayoutDashboard, ClipboardList, ShoppingCart, Warehouse, 
  Factory, Truck, BookOpen, Grid, AppWindow, AlertCircle, Tag, Layers, 
  MoreHorizontal, MessageSquare, PanelLeft, AlertTriangle, Loader2, 
  Inbox, Smartphone, PieChart, Code, CheckCircle, XCircle, Info
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const allIcons = [
  { group: "Aksi & Interaksi", color: "text-blue-500", items: [
    { name: "Menu", icon: Menu, label: "Membuka navigasi sidebar / Mobile Menu" },
    { name: "X", icon: X, label: "Menutup modal, laci, atau menghapus item" },
    { name: "MoreHorizontal", icon: MoreHorizontal, label: "Menu aksi tambahan (dropdown)" },
    { name: "ToggleLeft", icon: ToggleLeft, label: "Switch atau tombol aksi status" },
  ]},
  { group: "Feedback & Status", color: "text-rose-500", items: [
    { name: "AlertCircle", icon: AlertCircle, label: "Peringatan minor, konfirmasi, atau badge butuh perhatian" },
    { name: "AlertTriangle", icon: AlertTriangle, label: "Peringatan kritis, error berbahaya, atau konfirmasi destruktif" },
    { name: "CheckCircle", icon: CheckCircle, label: "Status berhasil, disetujui, terselesaikan" },
    { name: "XCircle", icon: XCircle, label: "Status gagal, ditolak, dibatalkan" },
    { name: "Info", icon: Info, label: "Informasi umum atau tooltip penjelasan" },
    { name: "Loader2", icon: Loader2, label: "Loading / Spinner untuk memuat data" },
    { name: "Inbox", icon: Inbox, label: "Empty state data kosong, pesan, atau kotak masuk" },
  ]},
  { group: "Data & Dokumen", color: "text-emerald-500", items: [
    { name: "FileText", icon: FileText, label: "Formulir, dokumen, atau input data tunggal" },
    { name: "List", icon: List, label: "Tabel data, daftar katalog item" },
    { name: "Tag", icon: Tag, label: "Label kategori, badge, status khusus" },
    { name: "PieChart", icon: PieChart, label: "Dashboard grafik, analitik, report data" },
    { name: "Code", icon: Code, label: "Panduan implementasi teknis, coding guidelines" },
  ]},
  { group: "Layout & Komponen Dasar", color: "text-amber-500", items: [
    { name: "PanelLeft", icon: PanelLeft, label: "Komponen Sidebar Navigasi" },
    { name: "AppWindow", icon: AppWindow, label: "Komponen Modal / Dialog popup" },
    { name: "Layers", icon: Layers, label: "Komponen Tabs untuk partisi konten" },
    { name: "Square", icon: Square, label: "Komponen Card" },
    { name: "MessageSquare", icon: MessageSquare, label: "Komponen Tooltip" },
    { name: "Smartphone", icon: Smartphone, label: "Panduan Responsivitas Mobile" },
  ]},
  { group: "Fondasi Desain", color: "text-fuchsia-500", items: [
    { name: "BookOpen", icon: BookOpen, label: "Pengantar, Overview, atau Dokumen Bacaan" },
    { name: "Type", icon: Type, label: "Aturan Tipografi / Font" },
    { name: "Palette", icon: Palette, label: "Palet Warna / Color System" },
    { name: "Space", icon: Space, label: "Panduan Spacing / Jarak Antar Elemen" },
    { name: "Circle", icon: Circle, label: "Panduan Radius Sudut (Border Radius)" },
    { name: "Grid", icon: Grid, label: "Panduan Susunan Grid & Elevasi" },
  ]},
  { group: "Modul ERP Utama", color: "text-violet-500", items: [
    { name: "LayoutDashboard", icon: LayoutDashboard, label: "Modul Eksekutif / Dashboard Utama" },
    { name: "ClipboardList", icon: ClipboardList, label: "Modul Perencanaan / Production Planning" },
    { name: "ShoppingCart", icon: ShoppingCart, label: "Modul Purchasing / Pembelian Material" },
    { name: "Warehouse", icon: Warehouse, label: "Modul Inventory / Gudang Material Berjalan" },
    { name: "Factory", icon: Factory, label: "Modul Manufaktur & Perakitan" },
    { name: "Truck", icon: Truck, label: "Modul Pengiriman & Logistik (Delivery)" },
  ]}
];

export default function IconographyPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Iconography</h1>
        <p className="mt-2 text-slate-600">
          Daftar ikon yang digunakan di seluruh antarmuka Apex Ferro ERP. 
          Semua ikon menggunakan <a href="https://lucide.dev" target="_blank" rel="noreferrer" className="text-[#006600] underline font-medium">Lucide Icons</a>.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Warna & Makna Ikon</h2>
        <p className="text-slate-600 mb-6">
          Ikon diwarnai sesuai dengan konteks atau modul yang direpresentasikan. Untuk penggunaan reguler di dalam modul ERP (seperti pada tabel atau tombol), warna ikon umumnya menyesuaikan warna teks disebelahnya atau mengikuti tema komponen.
        </p>

        <div className="space-y-8">
          {allIcons.map((group, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                <div className={"w-4 h-4 rounded-full bg-current " + group.color}></div>
                <h3 className="font-semibold text-slate-800">{group.group}</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <div key={itemIdx} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm">
                          <Icon className={"h-6 w-6 " + group.color} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <p className="text-sm text-slate-500 mt-1 max-w-md">{item.label}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <code className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md border border-slate-200">
                          {item.name}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(item.name)}
                          className="h-8 w-8 flex-shrink-0"
                        >
                          {copied === item.name ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
