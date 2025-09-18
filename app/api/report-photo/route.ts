export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { sbAdmin } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const s = await getSession();
  if (s?.role !== "branch")
    return NextResponse.json({ error: "yetki" }, { status: 401 });

  const { reportId, path } = await req.json();
  if (!reportId || !path)
    return NextResponse.json({ error: "parametre" }, { status: 400 });

  const { error } = await sbAdmin()
    .from("report_photos")
    .insert({ report_id: reportId, storage_path: path });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
