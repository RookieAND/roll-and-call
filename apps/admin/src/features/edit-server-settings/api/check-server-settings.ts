"use server";

import { parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireOwner } from "@/shared/server";

import { checkSettingId } from "../model/check-setting-id";
import { SETTING_FAIL_REASON, type SettingCheck } from "../model/setting-check";
import { SETTING_FIELDS, type SettingFieldKey } from "../model/setting-field";
import { settingIdsSchema } from "../model/setting-ids-schema";
import { loadGuildSnapshot } from "./load-guild-snapshot";

export type SettingChecks = Partial<Record<SettingFieldKey, SettingCheck>>;

// [확인] 한 번(항목 하나)과 화면을 열 때(저장된 항목 전부) 모두 이 액션으로 봇 검증을 한다. 빈 값은 건너뛴다.
export async function checkServerSettings(
  rawIds: Partial<Record<SettingFieldKey, string>>,
): Promise<SettingChecks> {
  await requireOwner();
  const ids = parseActionInput(settingIdsSchema.partial(), rawIds);
  const server = await getCurrentServer();
  const entries = SETTING_FIELDS.flatMap(({ key }) => {
    const id = ids[key]?.trim();
    return id ? [[key, id] as const] : [];
  });
  if (entries.length === 0) return {};
  const guild = await loadGuildSnapshot(server.discordGuildId);
  return Object.fromEntries(
    entries.map(([field, id]) => [
      field,
      guild
        ? checkSettingId({ field, id, guild })
        : { status: "fail", reason: SETTING_FAIL_REASON.unreachable },
    ]),
  );
}
