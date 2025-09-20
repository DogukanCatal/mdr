import { sbAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reportId = searchParams.get("reportId");
  if (!reportId) return NextResponse.json({ urls: [] });

  const sb = sbAdmin();
  const { data, error } = await sb
    .from("report_photos")
    .select("storage_path")
    .eq("report_id", reportId);

  if (error) {
    console.error("DB error:", error);
    return NextResponse.json({ urls: [] }, { status: 500 });
  }

  // private bucket için signed url üretelim (60 dk geçerli)
  const urls: string[] = [];
  for (const x of data ?? []) {
    const { data: signed, error: sErr } = await sb.storage
      .from("branch-logs")
      .createSignedUrl(x.storage_path, 60 * 60);
    if (signed?.signedUrl) urls.push(signed.signedUrl);
    if (sErr) console.error("Signed URL error:", sErr);
  }

  return NextResponse.json({ urls });
}
