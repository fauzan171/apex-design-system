import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreVertical, Eye, Edit, Trash2, ArrowUpDown, ArrowDown, Inbox } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor', status: 'Inactive' },
];

export default function TablesPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Tables</h1>
        <p className="mt-2 text-slate-600">
          Tables display data in rows and columns for easy scanning and comparison.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tujuan Penggunaan</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Manajemen master data (Vendor, Material, Pengguna).</li>
          <li>Menampilkan daftar transaksi (Pemesanan, Pengiriman barang).</li>
          <li>Data dengan aksi per-baris (Edit, Hapus, Approve).</li>
        </ul>
      </section>

      {/* Advanced Table with Sorting & Pagination */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Movable, Sortable, & Paginated Table</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-[250px]">
                    <Button variant="ghost" className="p-0 hover:bg-transparent flex items-center gap-1 font-semibold">
                      Nama <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent flex items-center gap-1 font-semibold text-[#006600]">
                      Role <ArrowDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-500">Menampilkan 1-3 dari 120 data</span>
            <Pagination className="justify-end w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </section>

      {/* Empty State Table */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Empty State Table</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>ID Dokumen</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Inbox className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="font-medium text-slate-700">Tidak Ada Data</p>
                    <p className="text-sm">Belum ada dokumen yang dibuat hari ini.</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Do & Don't</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center"><span className="mr-2">✓</span> Do</h3>
            <p className="text-sm text-green-700">Pastikan angka rata kanan (right-aligned) agar mudah dijumlahkan/dibandingkan secara visual.</p>
            <p className="text-sm text-green-700 mt-2">Gunakan Dropdown Menu untuk aksi (kebab-icon) pada baris jika action baris tersebut lebih dari 2.</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center"><span className="mr-2">✕</span> Don't</h3>
            <p className="text-sm text-red-700">Tabel tanpa pagination jika baris berpotensi lebih dari 50. Tabel yang tak berujung menurunkan performa peramban klien.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spesifikasi Developer</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <ul className="space-y-2 text-sm">
            <li><strong>Component:</strong> <code>@/components/ui/table</code></li>
            <li><strong>Responsive Wrapper:</strong> Gunakan <code>&lt;div className="overflow-x-auto"&gt;</code> mengelilingi <code>&lt;Table&gt;</code>.</li>
            <li><strong>Header:</strong> <code>bg-slate-50 font-semibold text-slate-700</code></li>
            <li><strong>Striped Layout:</strong> (Opsional untuk data padat) gunakan class <code>bg-slate-50</code> pada baris ganjil.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
