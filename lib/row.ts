export type Row = {
  id: string;
  branch_id: string;
  report_date: string;
  report_time: string;
  cashier_name: string | null;
  sistem_toplam: number | null;
  nakit_toplam: number | null;
  digital_toplam: number | null;
  ara_toplam: number | null;
  personel_toplam: number | null;
  kasa_toplam: number | null;
  market_gideri_toplam: number | null;
  ac_kapa_toplam: number | null;
};
