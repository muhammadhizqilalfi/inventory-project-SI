import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logout berhasil" },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/login",
      maxAge: 0, 
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat logout" },
      { status: 500 }
    );
  }
}