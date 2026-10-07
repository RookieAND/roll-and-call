import type { Metadata } from "next";

import { getCurrentServer } from "@/shared/server";
import { ServerSettingsForm } from "@/views/settings";

export const metadata: Metadata = { title: "설정 · 서버 설정" };

// 화면 가드는 settings/(owner)/layout이 한다. 여기서 requireOwner를 부르면 소유자 아님 화면 대신 403이 뜬다.
export default async function SettingsServerPage() {
  const server = await getCurrentServer();
  const userAppUrl = process.env.NEXT_PUBLIC_USER_APP_URL ?? "";
  return (
    <ServerSettingsForm
      server={{ name: server.name, slug: server.slug, icon: server.icon }}
      savedInviteUrl={server.inviteUrl ?? ""}
      joinUrl={`${userAppUrl}/${server.slug}/join`}
    />
  );
}
