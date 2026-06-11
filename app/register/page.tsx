"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Boxes, LockKeyhole, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Pendaftaran gagal, silakan coba lagi.");
      }

      setIsSuccess(true);
      setMessage("Akun berhasil dibuat! Mengalihkan ke halaman login...");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setMessage(err.message);
      setIsSuccess(false);
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
              Mulai Kelola Gudang dengan Inventra
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Buat akun untuk mengakses sistem inventaris, memantau stok,
              mengelola barang masuk dan keluar, serta melihat laporan
              operasional gudang.
            </p>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {[
                ["Inventory", "Terkelola"],
                ["Gudang", "Terpantau"],
                ["Laporan", "Real-time"],
              ].map(([title, status]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{status}</p>
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
              Daftar ke Inventra
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Buat akun baru untuk mulai menggunakan sistem inventory.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {message && (
              <div
                className={`rounded-xl border px-4 py-3 ${
                  isSuccess
                    ? "border-emerald-100 bg-emerald-50"
                    : "border-red-100 bg-red-50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    isSuccess ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {message}
                </p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nama
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  required
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={isLoading || isSuccess}
              className={`w-full rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition ${
                isLoading || isSuccess
                  ? "cursor-not-allowed bg-sky-400"
                  : "bg-sky-600 hover:bg-sky-700 active:scale-[0.99]"
              }`}
            >
              {isLoading ? "Mendaftarkan..." : "Buat Akun"}
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
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-sky-700 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
