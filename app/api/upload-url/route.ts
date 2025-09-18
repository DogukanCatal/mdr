export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { sbAdmin } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const s = await getSession();
  if (s?.role !== "branch")
    return NextResponse.json({ error: "yetki" }, { status: 401 });

  const { reportId, fileExt = "jpg", reportDate } = await req.json();
  if (!reportId)
    return NextResponse.json({ error: "parametre" }, { status: 400 });

  const yyyyMmDd = reportDate ?? new Date().toISOString().slice(0, 10);
  const path = `${
    s.branchId
  }/${yyyyMmDd}/${reportId}/${crypto.randomUUID()}.${fileExt}`;

  const { data, error } = await sbAdmin()
    .storage.from("branch-logs")
    .createSignedUploadUrl(path);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ url: data.signedUrl, path });
}
