import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const s = await getSession();
  if (s?.role === "admin") redirect("/admin/panel");
  if (s?.role === "branch") redirect("/branch/dashboard");
  return (
    <main className="p-6 space-y-4 flex items-center justify-center min-h-screen">
      <div className="space-x-4">
        <Button>
          <Link href="/login-branch">Şube Girişi</Link>
        </Button>

        <Button>
          <Link href="/login-admin">Admin Girişi</Link>
        </Button>
      </div>
    </main>
  );
}
