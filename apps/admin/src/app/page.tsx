import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionAccount, listMyServers } from "@/shared/server";
import { PlatformServerSelectView, SERVER_FILTER, ServerSelectView } from "@/views/server-select";

export const metadata: Metadata = { title: "서버 선택" };

export default async function ServerSelectPage({ searchParams }: PageProps<"/">) {
  const account = await getSessionAccount();
  if (!account) redirect("/login");
  const servers = await listMyServers();
  if (account.platformAdmin) {
    const { q, filter } = (await searchParams) as Record<string, string | undefined>;
    const knownFilter = Object.values(SERVER_FILTER).find((value) => value === filter);
    return (
      <PlatformServerSelectView
        nickname={account.nickname}
        servers={servers}
        query={{ q, filter: knownFilter }}
      />
    );
  }
  if (servers.length === 0) redirect("/denied");
  if (servers.length === 1) redirect(`/${servers[0]!.slug}`);
  return <ServerSelectView nickname={account.nickname} servers={servers} />;
}
