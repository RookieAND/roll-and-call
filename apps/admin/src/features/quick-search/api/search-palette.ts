"use server";

import { z } from "zod";

import { parseActionInput } from "@/shared/lib";
import { requireStaff, searchUsers } from "@/shared/server";

const schema = z.string().max(200);

export async function searchPalette(query: string) {
  await requireStaff();
  return searchUsers(parseActionInput(schema, query));
}
