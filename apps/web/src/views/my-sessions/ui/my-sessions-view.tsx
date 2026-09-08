import { Container } from "@trpg/ui";
import { redirect } from "next/navigation";
import {
  bucketHosted,
  bucketJoined,
  type SessionCardModel,
  type SessionRole,
} from "@/entities/game";
import { getGamesByGm, getJoinedGames } from "@/entities/game/index.server";
import { SessionTabFilter, type SessionTab } from "./session-tab-filter";
import { getCurrentUser } from "@/shared/api/supabase/server";
import { AppBar } from "@/shared/ui/app-bar";
import { EmptyState } from "@/shared/ui/empty-state";
import { SessionList } from "@/widgets/session-list";

type RoleConfig = {
  basePath: string;
  title: string;
  tabs: SessionTab[];
  // headline count(앱바 옆 숫자) = 기본 탭 건수. 탭 전환과 무관하게 페이지 정체성 유지.
  headlineTab: string;
};

const CONFIG: Record<SessionRole, RoleConfig> = {
  host: {
    basePath: "/me/sessions/hosted",
    title: "운영 중인 세션",
    headlineTab: "recruiting",
    tabs: [
      { key: "recruiting", label: "모집 중" },
      { key: "confirmed", label: "확정" },
      { key: "closed", label: "종료" },
    ],
  },
  player: {
    basePath: "/me/sessions/joined",
    title: "참여한 세션",
    headlineTab: "confirmed",
    tabs: [
      { key: "confirmed", label: "확정" },
      { key: "waiting", label: "대기" },
      { key: "closed", label: "종료" },
    ],
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
  const headlineCount = (byTab[config.headlineTab] ?? []).length;

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
