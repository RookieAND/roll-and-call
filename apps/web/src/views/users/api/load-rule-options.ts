import { getRulebookRecords } from "@roll-and-call/database/certifications";

import { rulebookLabel } from "@/entities/rulebook";
import { getCurrentServer } from "@/shared/server";

import type { RuleOption } from "../model/rule-option";

export async function loadRuleOptions(): Promise<RuleOption[]> {
  const server = await getCurrentServer();
  const { catalog } = await getRulebookRecords({ serverId: server.id, userId: null });
  return catalog.map((rulebook) => ({ id: rulebook.id, label: rulebookLabel(rulebook) }));
}
