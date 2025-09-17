export const runtime = "nodejs";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sbAdmin } from "@/lib/supabase/server";
import { setSession } from "@/lib/session";

export async function POST(req: Request) {
  const { code, password } = await req.json();

  const { data: b, error } = await sbAdmin()
    .from("branches")
    .select("id, hashed_password")
    .eq("code", code)
    .single();

  if (error || !b)
    return NextResponse.json({ error: "Şube bulunamadı" }, { status: 400 });

  const ok = await bcrypt.compare(password, b.hashed_password);
  if (!ok) return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });

  console.log(b);

  await setSession({ role: "branch", branchId: b.id });
  return NextResponse.json({ success: true });
}
