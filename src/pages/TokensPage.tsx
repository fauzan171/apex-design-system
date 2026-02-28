export default function TokensPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Implementation & Design Tokens</h1>
        <p className="mt-2 text-slate-600">
          Spesifikasi variabel teknik untuk Frontend Developer memprogram UI dengan standar seragam.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Warna (Colors)</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <pre className="text-sm font-mono leading-relaxed">
{`/* CSS Variables Implementation */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  --primary: 120 100% 20%; /* #006600 - Hijau Utama Apex */
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --border: 214.3 31.8% 91.4%; /* slate-200 equivalent */
  --input: 214.3 31.8% 91.4%;
  --ring: 120 100% 20%;      /* #006600 */
}`}
          </pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Border Radius & Padding</h2>
        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300">
          <pre className="text-sm font-mono leading-relaxed">
{`/* Global Border Radius Tokens */
--radius-sm: 0.125rem; /* 2px - Checkbox/Small Tags */
--radius: 0.375rem;    /* 6px - Buttons/Inputs (Base component) - rounded-md */
--radius-md: calc(var(--radius) - 2px); 
--radius-lg: 0.75rem;  /* 12px - Cards/Modals/Panels - rounded-xl */

/* Spacing Tokens */
Spacing Base = 4px (Tailwind px-1)
- Padding Content Default: 24px (p-6)
- Gap antar section/kartu: 24px (gap-6)
- Input Height Default: 36px (h-9)`}
          </pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Pendekatan Framework (Tailwind + Shadcn)</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <p className="text-sm text-slate-600">
            <strong>Jangan Custom Style Hardcode:</strong> Frontend Engineer diwajibkan menggunakan kelas utilitas yang dirancang sistem desain semaksimal mungkin, misal: <code>bg-primary text-primary-foreground focus-visible:ring-ring</code>, bukan menuliskan hex color sembarangan.
          </p>
          <p className="text-sm text-slate-600">
            <strong>Class Merge Strategy:</strong> Jika harus override base component, gunakan fungsi <code>cn()</code> yang telah di compile clsx dan tailwind-merge (Standar shadcn).
          </p>
        </div>
      </section>

    </div>
  );
}
