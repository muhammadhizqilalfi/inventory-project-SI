"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Boxes, LockKeyhole, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fallbackLoginError =
    "Login gagal. Periksa email dan password atau koneksi database.";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type") || "";
      let data: { error?: string } | null = null;

      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (!res.ok) {
        throw new Error(data?.error || fallbackLoginError);
      }

      router.push("/redirect");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : fallbackLoginError;
      setError(
        message.includes("Unexpected end of JSON input")
          ? fallbackLoginError
          : message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1 text-sm font-medium text-sky-700 shadow-sm">
              <Boxes size={16} />
              Sistem Informasi Gudang
            </div>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight text-slate-950">
              Inventra
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Kelola katalog barang, stok gudang, inbound, outbound, dan
              laporan operasional dalam satu dashboard yang rapi.
            </p>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {["SKU", "Inbound", "Reports"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-800">{item}</p>
                  <p className="mt-1 text-xs text-slate-500">Ready</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="mb-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-700">
              <Boxes size={24} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Masuk ke Inventra
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Gunakan akun yang terdaftar untuk mengelola inventory.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  required
                  type="email"
                  placeholder="nama@perusahaan.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  required
                  type="password"
                  placeholder="Masukkan password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Ingat saya
              </label>
              <Link
                href="/forgot-password"
                className="font-medium text-sky-700 transition hover:text-sky-900"
              >
                Lupa password?
              </Link>
            </div>

            <button
              disabled={isLoading}
              className={`w-full rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition ${
                isLoading
                  ? "cursor-not-allowed bg-sky-400"
                  : "bg-sky-600 hover:bg-sky-700 active:scale-[0.99]"
              }`}
            >
              {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 font-medium text-slate-400">
                Akses akun
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-sky-700 hover:underline"
            >
              Hubungi Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
