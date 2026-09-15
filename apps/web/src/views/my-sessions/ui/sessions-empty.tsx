import { Button } from "@trpg/ui";
import Link from "next/link";

import { EmptyState } from "@/shared/ui";
import type { SessionBucket } from "@/widgets/session-list";

import { sessionsHref } from "../model/sessions-href";

const EMPTY_BY_TAB: Record<
  SessionBucket,
  { title: string; href: string; label: string } | { title: string }
> = {
  joined: { title: "참여 중인 세션이 없습니다", href: "/games", label: "구인 목록 보기" },
  hosted: { title: "운영 중인 세션이 없습니다", href: "/games/new", label: "새 구인 등록" },
  past: { title: "끝난 세션이 없습니다" },
};

export function SessionsEmpty({
  activeTab,
  chipLabel,
}: {
  activeTab: SessionBucket;
  chipLabel: string | null;
}) {
  if (chipLabel) {
    return (
      <EmptyState
        size="section"
        title={`'${chipLabel}'인 세션이 없습니다`}
        action={
          <Button asChild variant="outline" className="h-11 w-full">
            <Link href={sessionsHref(activeTab)}>필터 해제</Link>
          </Button>
        }
      />
    );
  }

  const empty = EMPTY_BY_TAB[activeTab];
  const action =
    "href" in empty ? (
      <Button asChild className="h-11 w-full">
        <Link href={empty.href}>{empty.label}</Link>
      </Button>
    ) : undefined;

  return (
    <EmptyState
      size="section"
      image="/empty-states/empty-my-games.png"
      title={empty.title}
      action={action}
    />
  );
}
