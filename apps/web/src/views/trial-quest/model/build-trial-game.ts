import { RECRUIT_METHOD, SCHEDULE_MODE, PARTICIPANT_STATUS } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { TRIAL_GAME_ID, TRIAL_KIND, type TrialKind } from "./trial-kind";

export const TRIAL_VIEWER_ID = "trial-viewer";
const TRIAL_GM_ID = "trial-gm";
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function trialPerson(userId: string, username: string) {
  return { userId, user: { avatarUrl: null, username, bio: null } };
}

function trialParticipant({
  userId,
  username,
  status,
  now,
  order,
}: {
  userId: string;
  username: string;
  status: GameDetailData["participants"][number]["status"];
  now: Date;
  order: number;
}) {
  return {
    ...trialPerson(userId, username),
    joinedAt: new Date(now.getTime() - (10 - order) * HOUR_MS),
    status,
    drawRank: null,
    waitlistedAt: null,
    absent: false,
    absenceCancelledAt: null,
  };
}

// 체험 구인. 값은 모두 코드 상수이고 DB에 두지 않는다. 신청하면 내가 명단에 들어간다.
export function buildTrialGame({
  kind,
  applied,
  now,
}: {
  kind: TrialKind;
  applied: boolean;
  now: Date;
}): GameDetailData {
  const lottery = kind === TRIAL_KIND.lottery;
  const status = lottery ? PARTICIPANT_STATUS.waiting : PARTICIPANT_STATUS.confirmed;
  const others = lottery ? 5 : 2;
  const participants = Array.from({ length: others }, (_, index) =>
    trialParticipant({
      userId: `trial-player-${index + 1}`,
      username: `체험 플레이어 ${index + 1}`,
      status,
      now,
      order: index,
    }),
  );
  if (applied) {
    participants.push(
      trialParticipant({ userId: TRIAL_VIEWER_ID, username: "나", status, now, order: others }),
    );
  }
  const sessionAt = new Date(now.getTime() + (lottery ? 4 : 3) * DAY_MS);
  return {
    id: TRIAL_GAME_ID[kind],
    serverId: "trial-server",
    gmId: TRIAL_GM_ID,
    title: lottery ? "[연습] 추첨 세션" : "[연습] 선착순 세션",
    kind: "session",
    playType: "voice",
    rule: "CoC 7th",
    rulebookId: null,
    synopsis:
      "폭풍우가 치는 밤, 달빛 여관에서 손님 한 명이 사라진다. 남은 이들은 단서를 모아 그가 어디로 갔는지 찾는다.",
    thumbnailUrl: null,
    thumbnailSpoiler: false,
    images: [],
    playMinutes: 210,
    genres: ["호러", "미스터리"],
    triggers: [],
    platforms: ["디스코드"],
    notice: null,
    aiImage: false,
    maxPlayers: 4,
    minPlayers: null,
    minPlayersJudgedAt: null,
    recruitMethod: lottery ? RECRUIT_METHOD.lottery : RECRUIT_METHOD.firstCome,
    waitlistEnabled: true,
    applicationNoteEnabled: false,
    scheduleMode: SCHEDULE_MODE.fixed,
    endDate: new Date(sessionAt.getTime() - DAY_MS),
    rangeStart: null,
    rangeEnd: null,
    confirmedAt: sessionAt,
    windowStartHour: 12,
    windowEndHour: 0,
    notifiedAt: null,
    drawnAt: null,
    selectionFinishedAt: null,
    attendanceConfirmedAt: null,
    attendanceFirstConfirmedAt: null,
    endedAt: null,
    endNotifiedAt: null,
    capacityRaisedAt: null,
    discordThreadId: null,
    hiddenAt: null,
    hiddenBy: null,
    hiddenReasonCode: null,
    hiddenReasonText: null,
    cancelledAt: null,
    cancelledBy: null,
    cancelKind: null,
    cancelReason: null,
    createdAt: new Date(now.getTime() - DAY_MS),
    gm: { avatarUrl: null, username: "체험 GM", bio: null },
    participants,
  };
}
