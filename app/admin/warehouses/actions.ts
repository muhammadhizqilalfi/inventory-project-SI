"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWarehouse(formData: FormData) {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;

  if (!name || !location) return { error: "Field tidak boleh kosong" };

  try {
    await prisma.warehouse.create({
      data: { name, location },
    });

    // Refresh halaman agar data terbaru muncul
    revalidatePath("/admin/warehouses");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menyimpan ke database" };
  }
}

export async function createLocation(formData: FormData) {
  const warehouseId = formData.get("warehouseId") as string;
  const zone = formData.get("zone") as string;
  const rack = formData.get("rack") as string;
  const bin = formData.get("bin") as string;

  try {
    await prisma.storageLocation.create({
      data: {
        warehouseId,
        zone,
        rack,
        bin,
      },
    });
    revalidatePath("/admin/warehouses");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menambah lokasi rak" };
  }
}