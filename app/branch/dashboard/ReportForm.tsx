"use client";

import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportFormSchema, type ReportFormValues } from "@/lib/validation";
import { useTransition, useState } from "react";
import { createReport } from "./actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function Num(props: React.ComponentProps<"input">) {
  return (
    <Input
      {...props}
      inputMode="decimal"
      pattern="[0-9]*[.,]?[0-9]*"
      onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
    />
  );
}

export default function ReportForm() {
  const [pending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]); // photos ayrı

  const resolver = zodResolver(reportFormSchema) as Resolver<ReportFormValues>;

  const { register, handleSubmit, reset } = useForm<ReportFormValues>({
    resolver, // <— buraya ver
    mode: "onBlur",
    shouldUnregister: true,
    defaultValues: {
      reportDate: new Date(new Date().toDateString()), // Date
      reportTime: new Date().toTimeString().slice(0, 5),
      sistemToplam: 0,
      nakitToplam: 0,
      digitalToplam: 0,
      araToplam: 0,
      personelToplam: 0,
      kasaToplam: 0,
      marketGideri: 0,
      acKapa: 0,
    },
  });

  async function compressToWebP(
    file: File,
    { maxEdge = 1600, quality = 0.8 } = {}
  ): Promise<Blob> {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    ctx.drawImage(bmp, 0, 0, w, h);

    const blob: Blob = await new Promise((res, rej) =>
      canvas.toBlob(
        (b) => (b ? res(b) : rej(new Error("toBlob failed"))),
        "image/webp",
        quality
      )
    );
    return blob;
  }

  const onSubmit: SubmitHandler<ReportFormValues> = (values) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, String(v as any)));

    startTransition(async () => {
      const res = await createReport(fd); // ← DB insert
      if (!res.ok) {
        alert(res.error || "Hata");
        return;
      }
      const reportId = res.reportId as string;

      // Foto yükle
      await Promise.all(
        files.slice(0, 3).map(async (file) => {
          const compressed = await compressToWebP(file, {
            maxEdge: 1600,
            quality: 0.8,
          });

          const u = await fetch("/api/upload-url", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              reportId,
              fileExt: "webp",
              reportDate: values.reportDate.toISOString().slice(0, 10),
            }),
          }).then((r) => r.json());

          if (!u.url) throw new Error("upload url yok");
          await fetch(u.url, {
            method: "PUT",
            headers: { "content-type": "image/webp" },
            body: compressed,
          });

          await fetch("/api/report-photo", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ reportId, path: u.path }),
          });
        })
      );

      reset();
      setFiles([]);
      alert("Kaydedildi");
    });
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label>Tarih</Label>
        <Input type="date" {...register("reportDate", { valueAsDate: true })} />
      </div>

      <div className="space-y-2">
        <Label>Saat</Label>
        <Input type="time" {...register("reportTime")} />
      </div>

      <div className="space-y-2">
        <Label>İsim</Label>
        <Input placeholder="Kasiyer" {...register("cashierName")} />
      </div>

      <div className="space-y-2">
        <Label>Sistem Toplam</Label>
        <Num {...register("sistemToplam", { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label>Nakit Toplam</Label>
        <Num {...register("nakitToplam", { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label>Dijital Toplam</Label>
        <Num {...register("digitalToplam", { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label>Ara Toplam</Label>
        <Num {...register("araToplam", { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label>Personel Toplam</Label>
        <Num {...register("personelToplam", { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label>Kasa Toplam</Label>
        <Num {...register("kasaToplam", { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label>Market Gideri</Label>
        <Num {...register("marketGideri", { valueAsNumber: true })} />
      </div>

      <div className="space-y-2">
        <Label>Aç-Kapa Toplam</Label>
        <Num {...register("acKapa", { valueAsNumber: true })} />
      </div>

      <div className="md:col-span-3 space-y-2">
        <Label>Not</Label>
        <Textarea rows={2} {...register("note")} />
      </div>

      <div className="md:col-span-3 space-y-2">
        <Label>Fotoğraflar (en fazla 3)</Label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setFiles(Array.from(e.target.files || []).slice(0, 3))
          }
        />
      </div>

      <div className="md:col-span-3">
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
