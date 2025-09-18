import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { sbAdmin } from "@/lib/supabase/server";
import AdminFilters from "./AdminFilters";

type Branch = { id: string; name: string; code: string };
type Row = {
  id: string;
  branch_id: string;
  report_date: string;
  report_time: string;
  cashier_name: string | null;
  sistem_toplam: number;
  nakit_toplam: number;
  digital_toplam: number;
  ara_toplam: number;
  personel_toplam: number;
  kasa_toplam: number;
  market_gideri: number;
  ac_kapa: number;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string; from?: string; to?: string }>;
}) {
  const s = await getSession();
  if (s?.role !== "admin") redirect("/login-admin");

  const sb = sbAdmin();

  // şubeler
  const brq = await sb.from("branches").select("id, name, code").order("name");
  const branches: Branch[] = brq.data ?? [];

  // filtreler
  const sp = await searchParams; // <-- await şart
  const branchId = sp.branch ?? undefined;
  const from = sp.from ?? undefined;
  const to = sp.to ?? undefined;

  let q = sb
    .from("daily_reports")
    .select(
      "id, branch_id, report_date, report_time, cashier_name, sistem_toplam, nakit_toplam, digital_toplam, ara_toplam, personel_toplam, kasa_toplam, market_gideri, ac_kapa"
    )
    .order("report_date", { ascending: false })
    .order("report_time", { ascending: false });

  if (branchId) q = q.eq("branch_id", branchId);
  if (from) q = q.gte("report_date", from);
  if (to) q = q.lte("report_date", to);

  const rq = await q;
  const rows: Row[] = rq.data ?? [];

  const summary = rows.reduce(
    (a, r) => ({
      count: a.count + 1,
      sistem: a.sistem + Number(r.sistem_toplam || 0),
      nakit: a.nakit + Number(r.nakit_toplam || 0),
      digital: a.digital + Number(r.digital_toplam || 0),
      kasa: a.kasa + Number(r.kasa_toplam || 0),
      gider: a.gider + Number(r.market_gideri || 0),
    }),
    { count: 0, sistem: 0, nakit: 0, digital: 0, kasa: 0, gider: 0 }
  );

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-lg font-bold">Admin Panel</h1>

      <AdminFilters branches={branches} />

      {/* ... tablo aynı ... */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th className="py-2 pr-4">Tarih</th>
              <th className="py-2 pr-4">Saat</th>
              <th className="py-2 pr-4">Şube</th>
              <th className="py-2 pr-4">İsim</th>
              <th className="py-2 pr-4">Sistem</th>
              <th className="py-2 pr-4">Nakit</th>
              <th className="py-2 pr-4">Dijital</th>
              <th className="py-2 pr-4">Kasa</th>
              <th className="py-2 pr-4">Gider</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const b = branches.find((x) => x.id === r.branch_id);
              return (
                <tr key={r.id} className="border-b">
                  <td className="py-2 pr-4">{r.report_date}</td>
                  <td className="py-2 pr-4">{r.report_time}</td>
                  <td className="py-2 pr-4">{b?.code || r.branch_id}</td>
                  <td className="py-2 pr-4">{r.cashier_name ?? "-"}</td>
                  <td className="py-2 pr-4">{r.sistem_toplam.toFixed(2)}</td>
                  <td className="py-2 pr-4">{r.nakit_toplam.toFixed(2)}</td>
                  <td className="py-2 pr-4">{r.digital_toplam.toFixed(2)}</td>
                  <td className="py-2 pr-4">{r.kasa_toplam.toFixed(2)}</td>
                  <td className="py-2 pr-4">{r.market_gideri.toFixed(2)}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td className="py-4 text-muted-foreground" colSpan={9}>
                  Kayıt yok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
