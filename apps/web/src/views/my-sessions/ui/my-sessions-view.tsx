import { Button, Chip, Container, cn } from "@trpg/ui";
import Link from "next/link";
import { LoginRequired } from "@/features/auth";
import { getCurrentUser } from "@/shared/server";
import { AppBar, EmptyState } from "@/shared/ui";
import {
  loadMySessions,
  SESSION_CHIPS,
  SESSION_TABS,
  type SessionBucket,
  SessionList,
} from "@/widgets/session-list";
import { sessionsHref } from "../model/sessions-href";

const EMPTY: Record<SessionBucket, { title: string; href: string; label: string } | { title: string }> = {
  joined: { title: "참여 중인 세션이 없습니다", href: "/games", label: "구인 목록 보기" },
  hosted: { title: "운영 중인 세션이 없습니다", href: "/games/new", label: "새 구인 등록" },
  past: { title: "끝난 세션이 없습니다" },
};

// 내 세션 한 화면: 역할 탭 3개(건수는 탭 라벨에) + 탭별 상태 칩. 정렬은 가까운 것부터 고정.
export async function MySessionsView({ tab, status }: { tab?: string; status?: string }) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me" title="내 세션" />
        <Container size="sm">
          <div className="py-6">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const sessions = await loadMySessions(user.id);
  const activeTab = SESSION_TABS.find((t) => t.key === tab)?.key ?? "joined";
  const chips = SESSION_CHIPS[activeTab];
  const activeChip = chips.find((c) => c.key === status)?.key ?? "all";
  const list = sessions[activeTab];
  const items = activeChip === "all" ? list : list.filter((c) => c.chip === activeChip);

  const chipLabel = chips.find((c) => c.key === activeChip)?.label;
  const empty = EMPTY[activeTab];

  return (
    <>
      <AppBar back="/me" title="내 세션" />
      <div className="sticky top-[52px] z-10 border-b border-gray-100 bg-surface">
        {/* ponytail: 밑줄 탭은 Chip·SegmentControl과 룩이 달라 링크로 손코딩. */}
        <nav aria-label="역할" className="flex px-4">
          {SESSION_TABS.map((t) => {
            const selected = t.key === activeTab;
            return (
              <Link
                key={t.key}
                href={sessionsHref(t.key)}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "flex h-11 flex-1 items-center justify-center border-b-2 text-sm font-bold tabular-nums",
                  selected ? "border-primary-600 text-primary-ink" : "border-transparent text-hint",
                )}
              >
                {t.label} {sessions[t.key].length}
              </Link>
            );
          })}
        </nav>
        {chips.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto px-4 py-2.5">
            {chips.map((c) => {
              const selected = c.key === activeChip;
              return (
                <Chip key={c.key} asChild selected={selected} className="h-[34px]">
                  <Link href={sessionsHref(activeTab, c.key)} aria-current={selected ? "page" : undefined}>
                    {c.label}
                  </Link>
                </Chip>
              );
            })}
          </div>
        )}
      </div>

      <Container size="sm">
        <div className="py-3">
          {items.length > 0 ? (
            <SessionList items={items} />
          ) : activeChip !== "all" ? (
            <EmptyState
              size="section"
              title={`'${chipLabel}'인 세션이 없습니다`}
              action={
                <Button asChild variant="outline" className="h-11 w-full">
                  <Link href={sessionsHref(activeTab)}>필터 해제</Link>
                </Button>
              }
            />
          ) : (
            <EmptyState
              size="section"
              image="/empty-states/empty-my-games.png"
              title={empty.title}
              action={
                "href" in empty ? (
                  <Button asChild className="h-11 w-full">
                    <Link href={empty.href}>{empty.label}</Link>
                  </Button>
                ) : undefined
              }
            />
          )}
        </div>
      </Container>
    </>
  );
}
