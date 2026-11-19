import {
  NOTIFICATION_KIND,
  type NotificationInput,
} from "#db/modules/notifications/model/notification-kind";

type MovedRound = { roundNo: number; startsAt: Date; endsAt: Date };

// 회차 일정을 옮겼을 때의 알림. 받는 사람마다 옮긴 회차 한 건과, 이후 회차를 함께 옮겼으면 묶음 한 건이다(회차마다 보내지 않는다).
export function roundScheduleChangeNotices({
  game,
  userIds,
  moved,
  later,
}: {
  game: { id: string; title: string };
  userIds: readonly string[];
  moved: MovedRound;
  // 함께 옮긴 이후 회차들(번호 순서)과 옮긴 간격.
  later?: { rounds: readonly MovedRound[]; shiftMs: number };
}): NotificationInput[] {
  const params = { gameId: game.id, gameTitle: game.title };
  return userIds.flatMap((userId) => {
    const own: NotificationInput = {
      userId,
      kind: NOTIFICATION_KIND.roundScheduleChanged,
      params: {
        ...params,
        roundNo: moved.roundNo,
        startsAt: moved.startsAt.toISOString(),
        endsAt: moved.endsAt.toISOString(),
      },
    };
    if (!later || later.rounds.length === 0) return [own];
    return [
      own,
      {
        userId,
        kind: NOTIFICATION_KIND.laterRoundsChanged,
        params: {
          ...params,
          fromRoundNo: later.rounds[0]!.roundNo,
          toRoundNo: later.rounds.at(-1)!.roundNo,
          shiftMs: later.shiftMs,
        },
      },
    ];
  });
}
