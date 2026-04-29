import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Validasi input dasar
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // 2. Cek user yang sudah ada
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    // 3. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 4. Simpan ke database (Tambahkan field role)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "USER", // HARUS ADA sesuai enum UserRole di schema.prisma
      },
    });

    // 5. Keamanan: Jangan kirim password kembali ke client
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (err) {
    console.error("REGISTER_ERROR:", err); // Tambahkan log untuk debug di terminal
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" }, 
      { status: 500 }
    );
  }
}