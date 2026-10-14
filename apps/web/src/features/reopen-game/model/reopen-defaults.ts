import { pick } from "es-toolkit";

import { RULE_GATE, ruleGate, ruleSetOf, type MyRulebooks } from "@/entities/rulebook";
import type { Game } from "@/shared/server";

import { openSupplements } from "./open-supplements";

export const RULE_NOTICE = { notFound: "notFound", blocked: "blocked" } as const;

export type RuleNotice =
  | { kind: typeof RULE_NOTICE.notFound }
  | { kind: typeof RULE_NOTICE.blocked; label: string };

const CARRIED_COLUMNS = [
  "kind",
  "playType",
  "title",
  "synopsis",
  "genres",
  "triggers",
  "platforms",
  "notice",
  "aiImage",
  "playMinutesMin",
  "playMinutes",
  "maxPlayers",
  "minPlayers",
  "recruitMethod",
  "scheduleMode",
  "waitlistEnabled",
  "applicationNoteEnabled",
  "thumbnailUrl",
  "thumbnailSpoiler",
  "images",
] as const satisfies readonly (keyof Game)[];

// 일정·참여자·디스코드 글 같은 회차별 값은 가져오지 않는다. 일정 칸은 폼 기본값(비어 있음)으로 남는다.
// 룰은 저장된 이름이 아니라 룰북 ID로 지금의 판본을 찾아 채우고, 못 찾거나 인증이 막히면 비운다.
// 서플리먼트는 룰을 채울 때만 가져온다. 등록된 책은 지금 고를 수 있는 것만 남기고, 직접 입력한 책은 그대로 둔다.
export function reopenDefaults({
  game,
  rulebooks,
  now = new Date(),
}: {
  game: Pick<Game, (typeof CARRIED_COLUMNS)[number] | "rulebookId" | "supplements">;
  rulebooks: MyRulebooks;
  now?: Date;
}) {
  const carried = pick(game, CARRIED_COLUMNS);
  const set = game.rulebookId
    ? ruleSetOf({ myRulebooks: rulebooks, rulebookId: game.rulebookId })
    : null;
  const empty = { rule: "", rulebookId: "", supplements: [] };

  if (!set) {
    return {
      defaults: { ...carried, ...empty },
      ruleNotice: { kind: RULE_NOTICE.notFound } as const,
    };
  }
  if (ruleGate({ set, myRulebooks: rulebooks, now }).type === RULE_GATE.blocked) {
    return {
      defaults: { ...carried, ...empty },
      ruleNotice: { kind: RULE_NOTICE.blocked, label: set.label } as const,
    };
  }
  return {
    defaults: {
      ...carried,
      rule: set.label,
      rulebookId: set.cores[0]?.id ?? "",
      supplements: openSupplements({ supplements: game.supplements, set }),
    },
    ruleNotice: null,
  };
}
