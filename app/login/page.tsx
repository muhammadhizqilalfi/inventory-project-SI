"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State baru

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Mulai loading

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login gagal, periksa kembali email & password");
      }

      // Berhasil login
      router.push("/redirect");
      router.refresh(); // Pastikan server component mendeteksi auth baru
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Hentikan loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-lg mb-2">
             <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rotate-45"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
              </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Inventra</h1>
          <p className="text-sm text-gray-500">Log in to manage your inventory</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3">
              <p className="text-red-700 text-xs font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input
              required
              type="email"
              placeholder="nama@perusahaan.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              Ingat Saya
            </label>
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium">
              Lupa password?
            </Link>
          </div>

          <button
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white shadow-md transition-all ${
              isLoading 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]"
            }`}
          >
            {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Atau</span></div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Hubungi Admin
          </Link>
        </p>
      </div>
    </div>
  );
}