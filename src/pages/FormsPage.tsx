import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

export default function FormsPage() {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Input & Form</h1>
        <p className="mt-2 text-slate-600">
          Elemen input data merupakan komponen mendasar di sistem ERP. Kejelasan interaksi form sangat penting untuk efisiensi Entry Data.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tujuan Penggunaan</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Pembuatan master data baru (Inventory, Warehouse, Vendor).</li>
          <li>Form transaksi pembuatan dokumen operasional (PO, SO, Delivery Order).</li>
          <li>Konfigurasi dan pengaturan sistem (Settings).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">States & Variants</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="defaultInput">Default Input (Idle)</Label>
              <Input id="defaultInput" placeholder="Masukkan nama..." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="focusedInput">Hover / Focus State</Label>
              <Input id="focusedInput" placeholder="Sedang diketik..." className="ring-2 ring-ring ring-offset-2 border-primary" autoFocus />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="disabledInput" className="text-slate-400">Disabled Input</Label>
              </div>
              <Input id="disabledInput" placeholder="Tidak dapat diubah" disabled value="PT Vendor Abadi" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="errorInput" className="text-red-600">Input dengan Error</Label>
              <Input id="errorInput" placeholder="Error state" className="border-red-500 focus-visible:ring-red-500" defaultValue="1000A" />
              <p className="text-xs text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> Kolom ini hanya menerima angka
              </p>
            </div>
          </div>

        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Select & Textarea</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label>Label Kategori</Label>
              <Select value={selectedValue} onValueChange={setSelectedValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raw">Raw Material</SelectItem>
                  <SelectItem value="wip">Work In Progress</SelectItem>
                  <SelectItem value="fg">Finished Goods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Catatan (Opsional)</Label>
              <Textarea placeholder="Tulis catatan tambahan di sini..." rows={3} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Toggles (Optional Input)</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Label>Checkboxes</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="check1" defaultChecked />
                  <label htmlFor="check1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Termasuk Pajak</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check3" disabled />
                  <label htmlFor="check3" className="text-sm text-slate-400 font-medium leading-none">Auto-Approve (Disabled)</label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Switches</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="switch2" defaultChecked />
                  <label htmlFor="switch2" className="text-sm font-medium leading-none">Aktifkan Reminder Email</label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Radio Group</Label>
              <RadioGroup defaultValue="1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="r1" />
                  <Label htmlFor="r1">Tunai</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="r2" />
                  <Label htmlFor="r2">Kredit 30 Hari</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Tampilkan indikator format error persis pada kolom yang salah secara real-time / setelah di-blur.</p>
            <p className="text-sm text-green-700 mt-2">Gantungkan label di atas input (layout stacking), sangat membantu untuk scanabilitas yang cepat dibanding bentuk tabel inline label.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Menggunakan placeholder sebagai pengganti Label utama. Placeholder akan hilang ketika diketik, membingungkan pengguna.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spesifikasi Developer</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <ul className="space-y-2 text-sm">
            <li><strong>Component:</strong> <code>@/components/ui/input</code> dan <code>@/components/ui/label</code></li>
            <li><strong>Label Margin:</strong> Selalu berikan jarak minimal <code>space-y-2</code> antara Label dan Inputnya.</li>
            <li><strong>Validasi Error:</strong> Gunakan class merah pada input jika boolean error adalah true (<code>border-red-500 focus-visible:ring-red-500</code>).</li>
            <li><strong>Panjang Input:</strong> Sesuaikan max-width input dengan tipe data (misal: kode pos tidak sepanjang nama perusahaan).</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
