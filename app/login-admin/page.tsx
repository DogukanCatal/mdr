"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminLogin() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/login/admin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (r.ok) location.href = "/admin/panel";
    else alert((await r.json()).error || "Hata");
  }

  return (
    <form onSubmit={submit} className="p-6 space-y-3 max-w-sm mx-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="items-center justify-center space-y-2 ">
          <Input
            type="text"
            placeholder="Kullanıcı Adı"
            onChange={(e) => setU(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Şifre"
            onChange={(e) => setP(e.target.value)}
          />
          <Button type="submit" className="w-full font-bold">
            Giriş Yap
          </Button>
        </div>
      </div>
    </form>
  );
}
