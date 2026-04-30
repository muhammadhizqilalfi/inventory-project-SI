"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSupplier(formData: FormData) {
  const name = formData.get("name") as string;
  const contact = formData.get("contact") as string;
  const address = formData.get("address") as string;

  try {
    // Validasi duplikat
    const existing = await prisma.supplier.findUnique({ where: { name } });
    if (existing) return { error: "Nama supplier sudah terdaftar!" };

    await prisma.supplier.create({
      data: { name, contact, address },
    });
    revalidatePath("/admin/suppliers");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menambah supplier" };
  }
}

export async function updateSupplier(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const contact = formData.get("contact") as string;
  const address = formData.get("address") as string;

  try {
    await prisma.supplier.update({
      where: { id },
      data: { name, contact, address },
    });
    revalidatePath("/admin/suppliers");
    return { success: true };
  } catch (error) {
    return { error: "Gagal update supplier" };
  }
}

export async function deleteSupplier(id: string) {
  try {
    // Cek apakah supplier punya PO (Data Integrity)
    const hasOrders = await prisma.purchaseOrder.findFirst({ where: { supplierId: id } });
    if (hasOrders) return { error: "Supplier tidak bisa dihapus karena memiliki riwayat PO!" };

    await prisma.supplier.delete({ where: { id } });
    revalidatePath("/admin/suppliers");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus supplier" };
  }
}