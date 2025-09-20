"use client";

import { useState } from "react";
import { Row } from "@/lib/row";
import { RowDetail } from "./RowDetail";

type Branch = { id: string; name: string; code: string };

export default function ReportsTable({
  rows,
  branches,
}: {
  rows: Row[];
  branches: Branch[];
}) {
  const [selected, setSelected] = useState<Row | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  async function openDetail(row: Row) {
    setSelected(row);

    try {
      const res = await fetch(`/api/report-photos?reportId=${row.id}`);
      const data = await res.json();
      setPhotos(data.urls);
      console.log(data.urls);
    } catch (err) {
      console.error(err);
      setPhotos([]);
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th className="py-2 pr-4">Tarih</th>
              <th className="py-2 pr-4">Saat</th>
              <th className="py-2 pr-4">Şube</th>
              <th className="py-2 pr-4">İsim</th>
              <th className="py-2 pr-4">Sistem</th>
              <th className="py-2 pr-4">Nakit</th>
              <th className="py-2 pr-4">Dijital</th>
              <th className="py-2 pr-4">Kasa</th>
              <th className="py-2 pr-4">Gider</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const b = branches.find((x) => x.id === r.branch_id);
              return (
                <tr
                  key={r.id}
                  className="border-b cursor-pointer hover:bg-muted"
                  onClick={() => openDetail(r)}
                >
                  <td className="py-2 pr-4">{r.report_date}</td>
                  <td className="py-2 pr-4">{r.report_time}</td>
                  <td className="py-2 pr-4">{b?.code || r.branch_id}</td>
                  <td className="py-2 pr-4">{r.cashier_name ?? "-"}</td>
                  <td className="py-2 pr-4">
                    {Number(r.sistem_toplam ?? 0).toFixed(2)}
                  </td>
                  <td className="py-2 pr-4">
                    {Number(r.nakit_toplam ?? 0).toFixed(2)}
                  </td>
                  <td className="py-2 pr-4">
                    {Number(r.digital_toplam ?? 0).toFixed(2)}
                  </td>
                  <td className="py-2 pr-4">
                    {Number(r.kasa_toplam ?? 0).toFixed(2)}
                  </td>
                  <td className="py-2 pr-4">
                    {Number(r.market_gideri_toplam ?? 0).toFixed(2)}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="py-4 text-muted-foreground">
                  Kayıt yok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RowDetail
        row={selected}
        photos={photos}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
