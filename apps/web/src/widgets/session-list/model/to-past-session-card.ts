import { SESSION_ROLE, SESSION_STATE } from "@/entities/game";
import { formatDate, formatDateTime } from "@/shared/lib";

import type { SessionFacts } from "./derive-session-facts";
import { joinParts } from "./join-parts";
import {
  SESSION_BUCKET,
  SESSION_TONE,
  type SessionCardModel,
  type SessionGame,
} from "./session-card-model";

export function toPastSessionCard(game: SessionGame, facts: SessionFacts): SessionCardModel {
  const { base, seats, state } = facts;
  const finished = state === SESSION_STATE.finished && game.confirmedAt;
  const gmPart = base.role === SESSION_ROLE.player && `GM ${game.gm?.username ?? "?"}`;

  return {
    ...base,
    bucket: SESSION_BUCKET.past,
    chip: null,
    badge: finished ? "끝남" : "모집 마감",
    badgeColor: "gray",
    schedule: finished
      ? `${formatDateTime(game.confirmedAt!)} 진행`
      : `${formatDate(game.endDate)}에 모집 마감`,
    scheduleTone: SESSION_TONE.hint,
    meta: joinParts(game.rule, gmPart, seats),
    action: null,
    // 부호를 뒤집어 최근에 끝난 것부터 온다.
    sortKey: -new Date(game.confirmedAt ?? game.endDate).getTime(),
  };
}
