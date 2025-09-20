"use server";
import { sbAdmin } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { reportFormSchema } from "@/lib/validation";

export async function createReport(formData: FormData) {
  const raw = (await cookies()).get("session")?.value;
  const json = raw ? raw.slice(0, raw.lastIndexOf(".")) : "";
  const s = json ? JSON.parse(json) : null;
  if (!s || s.role !== "branch") return { ok: false, error: "yetki" };

  const parsed = reportFormSchema.safeParse({
    reportDate: formData.get("reportDate"),
    reportTime: formData.get("reportTime"),
    cashierName: formData.get("cashierName"),
    sistemToplam: formData.get("sistemToplam"),
    nakitToplam: formData.get("nakitToplam"),
    digitalToplam: formData.get("digitalToplam"),
    araToplam: formData.get("araToplam"),
    personelToplam: formData.get("personelToplam"),
    kasaToplam: formData.get("kasaToplam"),
    marketGideri: formData.get("marketGideri"),
    acKapa: formData.get("acKapa"),
    note: formData.get("note"),
  });
  if (!parsed.success)
    return { ok: false, error: "validasyon", issues: parsed.error.flatten() };
  const v = parsed.data;

  const { data, error } = await sbAdmin()
    .from("daily_reports")
    .insert({
      branch_id: s.branchId,
      report_date: v.reportDate,
      report_time: v.reportTime,
      cashier_name: v.cashierName ?? null,
      kasa_acilis: 150,
      sistem_toplam: v.sistemToplam,
      nakit_toplam: v.nakitToplam,
      digital_toplam: v.digitalToplam,
      ara_toplam: v.araToplam,
      personel_toplam: v.personelToplam,
      kasa_toplam: v.kasaToplam,
      market_gideri_toplam: v.marketGideri,
      ac_kapa_toplam: v.acKapa, // ← numeric
      note: v.note ?? null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, reportId: data.id };
}
