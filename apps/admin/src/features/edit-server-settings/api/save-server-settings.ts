"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireOwner, updateServerSettings } from "@/shared/server";

import { normalizeInviteUrl } from "../model/normalize-invite-url";
import { SETTING_FIELDS, type SettingIds } from "../model/setting-field";
import { settingIdsSchema } from "../model/setting-ids-schema";
import { settingsAudit } from "../model/settings-audit";
import { checkServerSettings, type SettingChecks } from "./check-server-settings";

interface SaveServerSettingsInput {
  // 한 화면에서 한쪽만 고치므로 안 넘긴 쪽은 저장된 값 그대로 둔다.
  ids?: SettingIds;
  inviteUrl?: string;
}

const saveServerSettingsSchema = z.object({
  ids: settingIdsSchema.optional(),
  inviteUrl: z.string().max(2000).optional(),
}) satisfies z.ZodType<SaveServerSettingsInput>;

type SaveServerSettingsResult =
  | { ok: true }
  | { ok: false; checks: SettingChecks }
  | { ok: false; inviteError: string };

const orNull = (value: string) => value.trim() || null;

// 바뀐 ID만 저장 직전에 봇 검증을 다시 한다. 바뀐 칸 중 하나라도 실패하면 저장하지 않고 검증 결과를 돌려준다.
// 바뀌지 않은 칸은 검증하지 않으므로, 봇 연결이 끊겨도 초대 링크만 고쳐 저장할 수 있다.
export async function saveServerSettings(
  args: SaveServerSettingsInput,
): Promise<SaveServerSettingsResult> {
  const actor = await requireOwner();
  const { ids, inviteUrl } = parseActionInput(saveServerSettingsSchema, args);
  const server = await getCurrentServer();
  const nextIds =
    ids ??
    (Object.fromEntries(
      SETTING_FIELDS.map((field) => [field.key, server[field.key] ?? ""]),
    ) as SettingIds);
  const invite = normalizeInviteUrl(inviteUrl ?? server.inviteUrl ?? "");
  if (!invite.ok) return { ok: false, inviteError: invite.error };
  const changedFields = SETTING_FIELDS.filter(
    (field) => orNull(nextIds[field.key]) !== server[field.key],
  );
  const checks = await checkServerSettings(
    Object.fromEntries(changedFields.map((field) => [field.key, nextIds[field.key]])),
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
      recruitChannelId: orNull(nextIds.recruitChannelId),
      closedChannelId: orNull(nextIds.closedChannelId),
      announceChannelId: orNull(nextIds.announceChannelId),
      staffChannelId: orNull(nextIds.staffChannelId),
      reviewForumChannelId: orNull(nextIds.reviewForumChannelId),
      inviteUrl: invite.url,
    },
    actor,
    audit,
  });
  revalidatePath("/", "layout");
  return { ok: true };
}
