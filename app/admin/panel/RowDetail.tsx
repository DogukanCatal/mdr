"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Row } from "@/lib/row";
import { PhotoPreview } from "./PhotoPreview";

type RowDetailProps = {
  row: Row | null;
  photos: string[];
  onClose: () => void;
};

export function RowDetail({ row, photos, onClose }: RowDetailProps) {
  if (!row) return null;

  return (
    <Dialog open={!!row} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detay</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p>
            <strong>Tarih:</strong> {row.report_date} {row.report_time}
          </p>
          <p>
            <strong>Kasiyer:</strong> {row.cashier_name ?? "-"}
          </p>
          <p>
            <strong>Aç-Kapa:</strong> {row.ac_kapa_toplam ?? "-"}
          </p>
          <p>
            <strong>Market Gideri:</strong> {row.market_gideri_toplam ?? "-"}
          </p>

          <div className="grid grid-cols-3 gap-2">
            {photos.map((url) => (
              <PhotoPreview key={url} url={url} />
            ))}
            {photos.length === 0 && <p>Fotoğraf yok</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
