"use server";

import { requireStaff, searchUsers } from "@/shared/server";

export async function searchPalette(query: string) {
  await requireStaff();
  return searchUsers(query);
}
