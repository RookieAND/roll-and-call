"use server";

import { revalidatePath } from "next/cache";

import { removeCertSeller, requireStaff } from "@/shared/server";

export async function deleteSeller(id: string) {
  const staff = await requireStaff();
  await removeCertSeller(id, staff);
  revalidatePath("/", "layout");
}
