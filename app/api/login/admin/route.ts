export const runtime = "nodejs";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sbAdmin } from "@/lib/supabase/server";
import { setSession } from "@/lib/session";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const { data: a, error } = await sbAdmin()
    .from("admins")
    .select("id, hashed_password")
    .eq("username", username)
    .single();

  if (error || !a)
    return NextResponse.json({ error: "Admin yok" }, { status: 400 });

  const ok = await bcrypt.compare(password, a.hashed_password);
  if (!ok) return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });

  await setSession({ role: "admin" });
  return NextResponse.json({ success: true });
}
