import type { Metadata } from "next";

import {
  checkServerSettings,
  SETTING_FIELDS,
  type SettingIds,
} from "@/features/edit-server-settings";
import { getCurrentServer, requireStaff } from "@/shared/server";
import { DiscordSettingsForm, DiscordSettingsMobileForm } from "@/views/discord";

export const metadata: Metadata = { title: "Discord · 디스코드 연동" };

// 화면 가드는 discord/(owner)/layout이 한다. 여기서 requireOwner를 부르면 소유자 아님 화면 대신 403이 뜬다.
export default async function DiscordLinkPage() {
  const [viewer, server] = await Promise.all([requireStaff(), getCurrentServer()]);
  const savedIds = Object.fromEntries(
    SETTING_FIELDS.map((field) => [field.key, server[field.key] ?? ""]),
  ) as SettingIds;
  const canCheck = viewer.role === "owner" && server.botConnected;
  const savedChecks = canCheck ? await checkServerSettings(savedIds) : {};
  const props = {
    serverName: server.name,
    botConnected: server.botConnected,
    savedIds,
    savedChecks,
  };
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <DiscordSettingsForm {...props} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <DiscordSettingsMobileForm {...props} />
      </div>
    </>
  );
}
