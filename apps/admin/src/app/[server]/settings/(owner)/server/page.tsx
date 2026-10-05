import type { Metadata } from "next";

import {
  checkServerSettings,
  SETTING_FIELDS,
  type SettingIds,
} from "@/features/edit-server-settings";
import { getCurrentServer, requireStaff } from "@/shared/server";
import { ServerSettingsForm } from "@/views/settings";

export const metadata: Metadata = { title: "설정 · 서버 설정" };

// 화면 가드는 settings/(owner)/layout이 한다. 여기서 requireOwner를 부르면 소유자 아님 화면 대신 403이 뜬다.
export default async function SettingsServerPage() {
  const [viewer, server] = await Promise.all([requireStaff(), getCurrentServer()]);
  const savedIds = Object.fromEntries(
    SETTING_FIELDS.map((field) => [field.key, server[field.key] ?? ""]),
  ) as SettingIds;
  const canCheck = viewer.role === "owner" && server.botConnected;
  const savedChecks = canCheck ? await checkServerSettings(savedIds) : {};
  const userAppUrl = process.env.NEXT_PUBLIC_USER_APP_URL ?? "";
  return (
    <ServerSettingsForm
      server={{ name: server.name, slug: server.slug, icon: server.icon }}
      botConnected={server.botConnected}
      savedIds={savedIds}
      savedChecks={savedChecks}
      savedInviteUrl={server.inviteUrl ?? ""}
      joinUrl={`${userAppUrl}/${server.slug}/join`}
    />
  );
}
