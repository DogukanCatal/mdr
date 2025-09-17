import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE = "session";
const SECRET = process.env.SESSION_SECRET!;

function sign(v: string) {
  const mac = crypto.createHmac("sha256", SECRET).update(v).digest("base64url");
  return `${v}.${mac}`;
}
function verify(signed?: string | undefined) {
  if (!signed) return null;
  const i = signed.lastIndexOf(".");
  if (i < 0) return null;
  const v = signed.slice(0, i);
  const mac = signed.slice(i + 1);
  const expect = crypto
    .createHmac("sha256", SECRET)
    .update(v)
    .digest("base64url");
  if (mac !== expect) return null;
  return JSON.parse(v);
}

export async function getSession() {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  return verify(raw) as null | { role: "branch" | "admin"; branchId?: string };
}

export async function setSession(payload: {
  role: "branch" | "admin";
  branchId?: string;
}) {
  const v = JSON.stringify(payload);
  const jar = await cookies();
  const isProd = process.env.NODE_ENV === "production";
  jar.set(COOKIE, sign(v), {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd, // dev’de false olmalı
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", { path: "/", maxAge: 0 });
}
