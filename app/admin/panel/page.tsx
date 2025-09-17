import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { sbAdmin } from "@/lib/supabase/server";

export default async function AdminPanel() {
  const s = await getSession();
  console.log(s?.role);
  if (s?.role !== "admin") redirect("/login-admin");
  const supabase = sbAdmin();
  const { data } = await supabase
    .from("daily_reports")
    .select("report_date, branch_id")
    .order("report_date", { ascending: false });

  return (
    <main className="p-6">
      <h1 className="font-bold mb-4">Admin Panel</h1>
      <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
      <form action="/api/logout" method="post" className="mt-6">
        <button className="border p-2">Çıkış</button>
      </form>
    </main>
  );
}
