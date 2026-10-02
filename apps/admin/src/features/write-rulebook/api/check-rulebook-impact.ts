"use server";

import { getRulebookImpact, requireStaff } from "@/shared/server";

import type { RulebookDraft } from "../model/rulebook-draft";

export async function checkRulebookImpact(id: string, draft: RulebookDraft) {
  await requireStaff();
  return getRulebookImpact({
    rulebookId: id,
    supersedesId: draft.kind === "core" ? draft.supersedesId : null,
    certRequired: draft.certRequired,
  });
}
