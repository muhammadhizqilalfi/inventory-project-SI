"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const categoryId = formData.get("categoryId") as string;
  const barcode = formData.get("barcode") as string;
  const unit = formData.get("unit") as string;
  const minStock = parseInt(formData.get("minStock") as string) || 0;

  await prisma.product.create({
    data: {
      name,
      categoryId,
      barcode: barcode || null,
      unit,
      minStock,
    },
  });

  revalidatePath("/admin/products"); // Refresh data di halaman tabel
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const categoryId = formData.get("categoryId") as string;
  const barcode = formData.get("barcode") as string;
  const unit = formData.get("unit") as string;
  const minStock = parseInt(formData.get("minStock") as string) || 0;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      categoryId,
      barcode: barcode || null,
      unit,
      minStock,
    },
  });
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });
  revalidatePath("/admin/products");
}