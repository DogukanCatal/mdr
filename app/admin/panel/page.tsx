import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { sbAdmin } from "@/lib/supabase/server";
import AdminFilters from "./AdminFilters";
import Stat from "./Stat";
import ReportsTable from "./ReportsTable"; // 👈 ekledik
import { Row } from "@/lib/row";

type Branch = { id: string; name: string; code: string };

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
  const sp = await searchParams;
  const branchId = sp.branch ?? undefined;
  const from = sp.from ?? undefined;
  const to = sp.to ?? undefined;

  let q = sb
    .from("daily_reports")
    .select(
      "id, branch_id, report_date, report_time, cashier_name, sistem_toplam, nakit_toplam, digital_toplam, ara_toplam, personel_toplam, kasa_toplam, market_gideri_toplam, ac_kapa_toplam"
    )
    .order("report_date", { ascending: false })
    .order("report_time", { ascending: false });

  if (branchId) q = q.filter("branch_id", "eq", branchId);
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
      gider: a.gider + Number(r.market_gideri_toplam || 0),
    }),
    { count: 0, sistem: 0, nakit: 0, digital: 0, kasa: 0, gider: 0 }
  );

  return (
    <main className="p-6 space-y-6 mx-auto w-full">
      <form action="/api/logout" method="post" className="mt-6">
        <button className="border p-2">Çıkış</button>
      </form>
      <h1 className="text-lg font-bold">Admin Panel</h1>

      <AdminFilters branches={branches} />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Stat label="Kayit" value={summary.count} />
        <Stat label="Sistem" value={summary.sistem} />
        <Stat label="Nakit" value={summary.nakit} />
        <Stat label="Dijital" value={summary.digital} />
        <Stat label="Kasa" value={summary.kasa} />
        <Stat label="Gider" value={summary.gider} />
      </div>

      {/* 👇 tabloyu direkt ReportsTable'dan al */}
      <ReportsTable rows={rows} branches={branches} />
    </main>
  );
}
