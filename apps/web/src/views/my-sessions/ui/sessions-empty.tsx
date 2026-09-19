import { Button } from "@trpg/ui";
import Link from "next/link";

import { SESSION_ROLE, type SessionRole } from "@/entities/game";
import { EmptyState } from "@/shared/ui";
import {
  ONGOING_CHIP,
  SESSION_CHIP,
  sessionsHref,
  type SessionChipKey,
} from "@/widgets/session-list";

// 빈 상태는 이 화면에 둔다. 마이페이지는 0으로 세기만 하고, 왜 비었는지와 다음 행동은 목록에서 말한다.
const ONGOING_EMPTY: Record<SessionRole, { title: string; body: string; href: string; label: string }> =
  {
    [SESSION_ROLE.player]: {
      title: "참여 중인 세션이 없습니다",
      body: "구인에 참여하면 여기에서\n일정과 확정 여부를 볼 수 있습니다.",
      href: "/games",
      label: "구인 목록 보기",
    },
    [SESSION_ROLE.host]: {
      title: "내가 연 세션이 없습니다",
      body: "구인을 올리면 모집과 일정 조율을\n여기에서 관리합니다.",
      href: "/games/new",
      label: "새 구인 등록",
    },
  };

export function SessionsEmpty({
  activeTab,
  activeChip,
}: {
  activeTab: SessionRole;
  activeChip: SessionChipKey;
}) {
  if (activeChip === ONGOING_CHIP) {
    const empty = ONGOING_EMPTY[activeTab];
    return (
      <EmptyState
        size="section"
        image="/empty-states/empty-my-games.png"
        title={empty.title}
        description={empty.body}
        action={
          <Button asChild className="h-11 w-full">
            <Link href={empty.href}>{empty.label}</Link>
          </Button>
        }
      />
    );
  }

  // 종료 칩에는 다음 행동을 두지 않는다. 기록을 보는 자리다.
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
      title="이 상태인 세션이 없습니다"
      action={
        <Button asChild variant="outline" className="h-11 w-full">
          <Link href={sessionsHref(activeTab)}>필터 해제</Link>
        </Button>
      }
    />
  );
}
