"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, requireOwner, updateServerSettings } from "@/shared/server";

import { normalizeInviteUrl } from "../model/normalize-invite-url";
import { SETTING_FIELDS, type SettingIds } from "../model/setting-field";
import { settingsAudit } from "../model/settings-audit";
import { checkServerSettings, type SettingChecks } from "./check-server-settings";

interface SaveServerSettingsInput {
  ids: SettingIds;
  inviteUrl: string;
}

type SaveServerSettingsResult =
  | { ok: true }
  | { ok: false; checks: SettingChecks }
  | { ok: false; inviteError: string };

const orNull = (value: string) => value.trim() || null;

// 바뀐 ID만 저장 직전에 봇 검증을 다시 한다. 바뀐 칸 중 하나라도 실패하면 저장하지 않고 검증 결과를 돌려준다.
// 바뀌지 않은 칸은 검증하지 않으므로, 봇 연결이 끊겨도 초대 링크만 고쳐 저장할 수 있다.
export async function saveServerSettings({
  ids,
  inviteUrl,
}: SaveServerSettingsInput): Promise<SaveServerSettingsResult> {
  const actor = await requireOwner();
  const server = await getCurrentServer();
  const invite = normalizeInviteUrl(inviteUrl);
  if (!invite.ok) return { ok: false, inviteError: invite.error };
  const changedFields = SETTING_FIELDS.filter(
    (field) => orNull(ids[field.key]) !== server[field.key],
  );
  const checks = await checkServerSettings(
    Object.fromEntries(changedFields.map((field) => [field.key, ids[field.key]])),
  );
  if (Object.values(checks).some((check) => check?.status === "fail")) return { ok: false, checks };

  const audit = settingsAudit({
    serverName: server.name,
    fields: changedFields.map((field) => {
      const check = checks[field.key];
      const display = check?.status === "ok" ? `#${check.name}` : null;
      return { label: field.auditLabel, display };
    }),
    inviteChanged: invite.url !== server.inviteUrl,
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
      inviteUrl: invite.url,
    },
    actor,
    audit,
  });
  revalidatePath("/", "layout");
  return { ok: true };
}
