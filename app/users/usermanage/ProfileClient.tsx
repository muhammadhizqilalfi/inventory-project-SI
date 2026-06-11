"use client";

import { useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Clock3,
  Edit3,
  LockKeyhole,
  Mail,
  User,
  X,
} from "lucide-react";

type ProfileUser = {
  name: string;
  email: string;
  status: string;
  joinedAt: string;
  activity: string;
  lastLogin: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export default function ProfileClient({ user }: { user: ProfileUser }) {
  const [profile, setProfile] = useState(user);
  const [draft, setDraft] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    {
      label: "Status Akun",
      value: profile.status,
      icon: BadgeCheck,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      label: "Tanggal Bergabung",
      value: profile.joinedAt,
      icon: CalendarDays,
      tone: "bg-slate-50 text-slate-700 ring-slate-200",
    },
    {
      label: "Aktivitas Sistem",
      value: profile.activity,
      icon: Clock3,
      tone: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    },
    {
      label: "Akses Profil",
      value: "Terverifikasi",
      icon: User,
      tone: "bg-sky-50 text-sky-700 ring-sky-100",
    },
  ];

  const handleEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(draft);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-sky-700">Account Center</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Profil Pengguna
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Informasi akun pengguna Inventra.
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/70 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-sky-50 text-2xl font-semibold text-sky-700 ring-1 ring-sky-100">
                {getInitials(profile.name) || "IV"}
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {profile.name}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Mail size={15} />
                  {profile.email}
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                <Edit3 size={16} />
                Edit Profil
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {item.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${item.tone}`}
                  >
                    <Icon size={17} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Informasi Akun
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Identitas dasar yang digunakan pada sistem Inventra.
              </p>
            </div>

            {isEditing && (
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <X size={16} />
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                >
                  <Check size={16} />
                  Simpan Perubahan
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nama Lengkap
              </label>
              <div className="relative">
                <User
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={draft.name}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={draft.email}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value="************"
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm font-semibold text-slate-600 outline-none"
                  readOnly
                />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Password disembunyikan untuk keamanan dan tidak dapat diedit
                dari halaman ini.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
              <LockKeyhole size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Keamanan Akun
              </h2>
              <p className="text-sm text-slate-500">
                Ringkasan keamanan dan akses pengguna.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Password Status
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                Terkunci dan terenkripsi
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Last Login
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {profile.lastLogin}
              </p>
            </div>

            <button
              type="button"
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
            >
              Ubah Password
            </button>
            <p className="text-center text-sm text-slate-500">
              Fitur akan tersedia pada versi berikutnya.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
