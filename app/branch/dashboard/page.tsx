import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { sbAdmin } from "@/lib/supabase/server";

export default async function BranchDash() {
  const s = await getSession();
  console.log(s?.role);
  if (s?.role !== "branch") redirect("/login-branch");

  const supabase = sbAdmin();
  const { data: reports } = await supabase
    .from("daily_reports")
    .select("report_date, sistem_toplam, nakit_toplam")
    .eq("branch_id", s.branchId)
    .order("report_date", { ascending: false });

  return (
    <main className="p-6">
      <h1 className="font-bold mb-4">Şube Raporları</h1>
      <pre className="text-sm">{JSON.stringify(reports, null, 2)}</pre>
      <form action="/api/logout" method="post" className="mt-6">
        <button className="border p-2">Çıkış</button>
      </form>
    </main>
  );
}
