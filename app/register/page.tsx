"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      
      // Beri jeda 2 detik agar user bisa membaca pesan sukses sebelum pindah
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
          <p className="text-sm text-gray-500">Create your account to get started</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          
          {message && (
            <div className={`p-3 rounded-lg border-l-4 ${
              isSuccess 
                ? "bg-green-50 border-green-500 text-green-700" 
                : "bg-red-50 border-red-500 text-red-700"
            }`}>
              <p className="text-xs font-medium">{message}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nama Lengkap</label>
            <input
              required
              type="text"
              placeholder="Masukkan nama lengkap"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input
              required
              type="password"
              placeholder="Minimal 8 karakter"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            disabled={isLoading || isSuccess}
            className={`w-full py-2.5 rounded-lg font-semibold text-white shadow-md transition-all ${
              isLoading || isSuccess
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]"
            }`}
          >
            {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Atau</span></div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}