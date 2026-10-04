"use server";

import { difference } from "es-toolkit";
import { revalidatePath } from "next/cache";

import {
  getCurrentServer,
  listRulebookOptions,
  requireOwner,
  updateServerSettings,
} from "@/shared/server";

import { normalizeInviteUrl } from "../model/normalize-invite-url";
import { SETTING_FIELDS, type SettingIds } from "../model/setting-field";
import { settingsAudit } from "../model/settings-audit";
import { checkServerSettings, type SettingChecks } from "./check-server-settings";

interface SaveServerSettingsInput {
  ids: SettingIds;
  inviteUrl: string;
  freeRulebookIds: string[];
}

type SaveServerSettingsResult = { ok: true } | { ok: false; checks: SettingChecks };

const orNull = (value: string) => value.trim() || null;

// 바뀐 ID는 저장 직전에 봇 검증을 다시 한다. 하나라도 실패하면 저장하지 않고 검증 결과를 돌려준다.
export async function saveServerSettings({
  ids,
  inviteUrl,
  freeRulebookIds,
}: SaveServerSettingsInput): Promise<SaveServerSettingsResult> {
  const actor = await requireOwner();
  const [server, rulebooks] = await Promise.all([getCurrentServer(), listRulebookOptions()]);
  const changedFields = SETTING_FIELDS.filter(
    (field) => orNull(ids[field.key]) !== server[field.key],
  );
  const checks = await checkServerSettings(
    Object.fromEntries(changedFields.map((field) => [field.key, ids[field.key]])),
  );
  if (Object.values(checks).some((check) => check?.status === "fail")) return { ok: false, checks };

  const currentFree = rulebooks.filter((rulebook) => rulebook.free).map((rulebook) => rulebook.id);
  const known = new Set(rulebooks.map((rulebook) => rulebook.id));
  const added = difference(freeRulebookIds, currentFree).filter((id) => known.has(id));
  const removed = difference(currentFree, freeRulebookIds);
  const labelOf = (id: string) => rulebooks.find((rulebook) => rulebook.id === id)?.label ?? id;
  const nextInviteUrl = normalizeInviteUrl(inviteUrl);

  const audit = settingsAudit({
    serverName: server.name,
    fields: changedFields.map((field) => {
      const check = checks[field.key];
      const prefix = field.key === "gmRoleId" ? "@" : "#";
      const display = check?.status === "ok" ? `${prefix}${check.name}` : null;
      return { label: field.auditLabel, display };
    }),
    inviteChanged: nextInviteUrl !== server.inviteUrl,
    addedRules: added.map(labelOf),
    removedRules: removed.map(labelOf),
  });
  if (!audit) return { ok: true };

  await updateServerSettings({
    serverId: server.id,
    settings: {
      recruitChannelId: orNull(ids.recruitChannelId),
      closedChannelId: orNull(ids.closedChannelId),
      announceChannelId: orNull(ids.announceChannelId),
      staffChannelId: orNull(ids.staffChannelId),
      reviewForumChannelId: orNull(ids.reviewForumChannelId),
      gmRoleId: orNull(ids.gmRoleId),
      inviteUrl: nextInviteUrl,
    },
    freeRulebookChanges: { added, removed },
    actor,
    audit,
  });
  revalidatePath("/", "layout");
  return { ok: true };
}
