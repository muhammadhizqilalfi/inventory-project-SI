"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) return;

  await prisma.category.create({
    data: { name },
  });

  revalidatePath("/admin/products");
}