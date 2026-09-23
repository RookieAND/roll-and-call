import { RECRUIT_METHOD } from "@/entities/game";
import { formatDate } from "@/shared/lib";

import type { SessionFacts } from "./derive-session-facts";
import { SESSION_ACTION_KIND, type SessionGame, type SessionTodo } from "./session-card-model";

// 한 구인에 걸린 GM의 일은 하나만 올린다. 막혀 있는 일(추첨·일시)이 먼저다.
export function hostTodo(
  game: SessionGame,
  facts: SessionFacts,
  responses: number,
): SessionTodo | null {
  const { confirmedCount, waitingCount } = facts;
  const participantsHref = `/games/${game.id}/participants`;

  if (facts.drawPending) {
    return {
      kind: SESSION_ACTION_KIND.drawLottery,
      label: "참여자 뽑기",
      href: participantsHref,
      blocked: true,
      lines: [
        `${formatDate(game.endDate)}에 신청이 마감됐습니다.`,
        `신청한 ${waitingCount}명 가운데 ${Math.max(game.maxPlayers - confirmedCount, 0)}명을 뽑아주세요.`,
      ],
    };
  }
  if (facts.awaitingTime) {
    return {
      kind: SESSION_ACTION_KIND.confirmTime,
      label: "세션 시간 정하기",
      href: facts.scheduleHref,
      blocked: true,
      lines: [
        "조율 기한이 지났습니다.",
        `지금까지 ${responses}명이 낸 시간으로 일시를 정할 수 있습니다.`,
      ],
    };
  }

  const openSeats = game.maxPlayers - confirmedCount;
  const beforeDraw = game.recruitMethod === RECRUIT_METHOD.lottery && game.drawnAt === null;
  if (waitingCount === 0 || openSeats <= 0 || beforeDraw) return null;

  // 마감 전·시간 미정이면 아직 안 본 신청이고, 그 뒤에 남은 자리는 누군가 빠진 빈자리다.
  if (!facts.line.deadlinePassed && !facts.timeSet) {
    return {
      kind: SESSION_ACTION_KIND.reviewApplicants,
      label: `신청 ${waitingCount}건 보기`,
      href: participantsHref,
      blocked: false,
      lines: [`신청 ${waitingCount}건이 들어와 있습니다.`, "아직 아무것도 보지 않았습니다."],
    };
  }
  return {
    kind: SESSION_ACTION_KIND.fillVacancy,
    label: "참여자 관리",
    href: participantsHref,
    blocked: false,
    lines: [
      `확정 자리가 ${openSeats}개 비었습니다.`,
      `대기 중인 ${waitingCount}명 가운데 누구를 올릴지 정해주세요.`,
    ],
  };
}
