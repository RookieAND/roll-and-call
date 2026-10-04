"use server";

import type { RulebookKind } from "@roll-and-call/database";

import { getKindImpact, requireStaff } from "@/shared/server";

export async function loadKindImpact(input: {
  rulebookId: string;
  nextKind: RulebookKind;
  query: string;
  cursor: string | null;
}) {
  await requireStaff();
  return getKindImpact(input);
}
