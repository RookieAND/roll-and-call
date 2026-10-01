import { Button } from "@roll-and-call/ui";
import Link from "next/link";
import type { ReactNode } from "react";

import { SESSION_ROLE, type SessionRole } from "@/entities/game";
import { EmptyState } from "@/shared/ui";
import {
  ONGOING_CHIP,
  SESSION_CHIP,
  sessionsHref,
  type SessionChipKey,
} from "@/widgets/session-list";

const ONGOING_EMPTY: Record<
  SessionRole,
  { title: string; body: ReactNode; href: string; label: string }
> = {
  [SESSION_ROLE.player]: {
    title: "참여 중인 세션이 없습니다",
    body: (
      <>
        구인에 참여하면 여기에서
        <br />
        일정과 확정 여부를 볼 수 있습니다.
      </>
    ),
    href: "/games",
    label: "구인 목록 보기",
  },
  [SESSION_ROLE.host]: {
    title: "내가 연 세션이 없습니다",
    body: (
      <>
        구인을 올리면 모집과 일정 조율을
        <br />
        여기에서 관리합니다.
      </>
    ),
    href: "/games/new",
    label: "새 구인 등록",
  },
};

const ONGOING_IMAGE: Record<SessionRole, string> = {
  [SESSION_ROLE.player]: "/empty-states/empty-my-games.png",
  [SESSION_ROLE.host]: "/empty-states/empty-hosted.png",
};

const FILTERED_TITLE: Partial<Record<SessionChipKey, string>> = {
  [SESSION_CHIP.scheduling]: "조율 중인 세션이 없습니다",
  [SESSION_CHIP.confirmed]: "확정된 세션이 없습니다",
  [SESSION_CHIP.waiting]: "대기 중인 세션이 없습니다",
  [SESSION_CHIP.recruiting]: "모집 중인 세션이 없습니다",
};

interface SessionsEmptyProps {
  activeTab: SessionRole;
  activeChip: SessionChipKey;
}

export function SessionsEmpty({ activeTab, activeChip }: SessionsEmptyProps) {
  if (activeChip === ONGOING_CHIP) {
    const empty = ONGOING_EMPTY[activeTab];
    return (
      <EmptyState
        size="section"
        image={ONGOING_IMAGE[activeTab]}
        title={empty.title}
        description={empty.body}
        action={
          <Button render={<Link href={empty.href} />} className="mt-100">
            {empty.label}
          </Button>
        }
      />
    );
  }

  if (activeChip === SESSION_CHIP.ended) {
    return (
      <EmptyState
        size="section"
        image="/empty-states/empty-my-games.png"
        title="끝난 세션이 없습니다"
        description="세션이 끝나면 여기에 기록으로 남습니다."
      />
    );
  }

  return (
    <EmptyState
      size="section"
      image="/empty-states/empty-search.png"
      title={FILTERED_TITLE[activeChip] ?? "이 상태인 세션이 없습니다"}
      description="필터를 풀면 진행 중인 세션을 모두 볼 수 있습니다."
      action={
        <Button
          render={<Link href={sessionsHref({ role: activeTab })} />}
          variant="outline"
          className="mt-100"
        >
          필터 해제
        </Button>
      }
    />
  );
}
