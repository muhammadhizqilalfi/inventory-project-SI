import { cookies } from "next/headers";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

function ProfileErrorState() {
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

      <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 ring-1 ring-slate-200">
          ?
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-950">
          Data pengguna tidak ditemukan
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Silakan login ulang atau hubungi admin.
        </p>
      </section>
    </div>
  );
}

export default async function UserProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <ProfileErrorState />;
  }

  let decoded: string | JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return <ProfileErrorState />;
  }

  const userId =
    typeof decoded === "object" && typeof decoded.id === "string"
      ? decoded.id
      : null;

  if (!userId) {
    return <ProfileErrorState />;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return <ProfileErrorState />;
  }

  return (
    <ProfileClient
      user={{
        name: user.name,
        email: user.email,
        status: "Aktif",
        joinedAt: user.createdAt.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        activity: user.updatedAt.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        lastLogin: "Tidak tersedia",
      }}
    />
  );
}
