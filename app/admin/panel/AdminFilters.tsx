"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AdminFilters({
  branches,
}: {
  branches: { id: string; name: string; code: string }[];
}) {
  const sp = useSearchParams();
  const router = useRouter();

  const [branch, setBranch] = useState(sp.get("branch") || "");
  const [from, setFrom] = useState(sp.get("from") || "");
  const [to, setTo] = useState(sp.get("to") || "");

  useEffect(() => {
    setBranch(sp.get("branch") || "");
    setFrom(sp.get("from") || "");
    setTo(sp.get("to") || "");
  }, [sp]);

  function apply() {
    const p = new URLSearchParams();
    if (branch) p.set("branch", branch);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    console.log("Apply =>", `/admin/panel?${p.toString()}`);
    router.push(`/admin/panel?${p.toString()}`);
    router.refresh();
  }
  function clearAll() {
    router.push(`/admin/panel`);
  }

  return (
    <div className="grid grid-cols-1 md:flex md:space-x-2 md:items-end gap-2">
      <div>
        <Label>Şube</Label>
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger>
            <SelectValue placeholder="Tümü" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.code} — {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Başlangıç</Label>
        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>
      <div>
        <Label>Bitiş</Label>
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="md:flex gap-2 items-end space-y-2 md:space-y-0">
        <Button type="button" onClick={apply} className="w-full">
          Uygula
        </Button>
        <Button variant="outline" className="w-full" onClick={clearAll}>
          Temizle
        </Button>
      </div>
    </div>
  );
}
