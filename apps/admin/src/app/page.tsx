import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { stringParams } from "@/shared/lib";
import { getSessionAccount, listMyServers } from "@/shared/server";
import {
  PlatformServerSelectMobileView,
  PlatformServerSelectView,
  SERVER_FILTER,
  ServerSelectMobileView,
  ServerSelectView,
} from "@/views/server-select";

export const metadata: Metadata = { title: "서버 선택" };

export default async function ServerSelectPage({ searchParams }: PageProps<"/">) {
  const account = await getSessionAccount();
  if (!account) redirect("/login");
  const servers = await listMyServers();
  if (account.platformAdmin) {
    const { q, filter, all } = stringParams(await searchParams);
    // 플랫폼 관리자도 직접 운영하는 서버가 하나면 바로 들어간다. 전체 목록은 ?all=1(스위처의 「전체 서버 목록에서 찾기」)로 연다.
    const joined = servers.filter((server) => server.joined);
    if (!all && joined.length === 1) redirect(`/${joined[0]!.slug}`);
    const knownFilter = Object.values(SERVER_FILTER).find((value) => value === filter);
    const query = { q, filter: knownFilter, all };
    return (
      <>
        <div data-view="desktop" className="contents max-lg:hidden">
          <PlatformServerSelectView nickname={account.nickname} servers={servers} query={query} />
        </div>
        <div data-view="mobile" className="contents lg:hidden">
          <PlatformServerSelectMobileView servers={servers} query={query} />
        </div>
      </>
    );
  }
  if (servers.length === 0) redirect("/denied");
  if (servers.length === 1) redirect(`/${servers[0]!.slug}`);
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <ServerSelectView nickname={account.nickname} servers={servers} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <ServerSelectMobileView servers={servers} />
      </div>
    </>
  );
}
