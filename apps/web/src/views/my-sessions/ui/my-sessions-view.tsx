import { Container } from "@trpg/ui";
import { redirect } from "next/navigation";
import type { SessionRole } from "@/entities/game";
import { getGamesByGm, getJoinedGames, getCurrentUser } from "@/shared/server";
import { SessionTabFilter } from "./session-tab-filter";
import { AppBar, EmptyState } from "@/shared/ui";
import {
  bucketHosted,
  bucketJoined,
  HOSTED_TABS,
  JOINED_TABS,
  type SessionCardModel,
  type SessionTab,
  SessionList,
} from "@/widgets/session-list";
type RoleConfig = {
  basePath: string;
  title: string;
  tabs: readonly SessionTab[];
  // headline count(앱바 옆 숫자) = 이 탭들의 건수 합. 탭 전환과 무관하게 페이지 정체성 유지.
  // 운영 중 = 모집 중 + 확정(마이페이지 "운영 중"과 같은 기준).
  headlineTabs: readonly string[];
};

const CONFIG: Record<SessionRole, RoleConfig> = {
  host: {
    basePath: "/me/sessions/hosted",
    title: "운영 중인 세션",
    headlineTabs: ["recruiting", "confirmed"],
    tabs: HOSTED_TABS,
  },
  player: {
    basePath: "/me/sessions/joined",
    title: "참여한 세션",
    headlineTabs: ["confirmed"],
    tabs: JOINED_TABS,
  },
};

export async function MySessionsView({ role, tab }: { role: SessionRole; tab?: string }) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const config = CONFIG[role];
  const buckets =
    role === "host"
      ? await getGamesByGm(user.id).then((g) => bucketHosted(g, user.id))
      : await getJoinedGames(user.id).then((g) => bucketJoined(g, user.id));

  const byTab = buckets as Record<string, SessionCardModel[]>;
  const known = config.tabs.some((t) => t.key === tab);
  const activeTab = known ? tab! : config.tabs[0]!.key;
  const items = byTab[activeTab] ?? [];
  const headlineCount = config.headlineTabs.reduce((n, t) => n + (byTab[t]?.length ?? 0), 0);

  return (
    <>
      <AppBar back="/me" title={`${config.title} ${headlineCount}`} />
      <SessionTabFilter
        tabs={config.tabs}
        active={activeTab}
        hrefFor={(key) => `${config.basePath}?tab=${key}`}
      />
      <Container size="sm">
        <div className="py-3">
          {items.length === 0 ? (
            <EmptyState title="해당하는 세션이 없습니다" />
          ) : (
            <SessionList items={items} />
          )}
        </div>
      </Container>
    </>
  );
}
