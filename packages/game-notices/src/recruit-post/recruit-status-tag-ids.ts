import type { GameKind, PlayType } from "@roll-and-call/database/games/model";

import type { RecruitTarget } from "./recruit-target";

// 모집 상태, 룰 분류, 플레이 유형, 구분 태그. 포럼에 없거나 연결하지 않은 것은 빠진다.
export function recruitStatusTagIds({
  target,
  closed,
  cancelled = false,
  categoryId,
  kind,
  playType,
  adultOnly = false,
}: {
  target: RecruitTarget;
  closed: boolean;
  cancelled?: boolean;
  // 룰 태그 열쇠(findGameRuleTagKey): 룰 분류 id, 자작 룰이면 HOMEBREW_FORUM_TAG_KEY.
  categoryId: string | null;
  kind: GameKind;
  playType: PlayType;
  adultOnly?: boolean;
}) {
  const { open, closed: closedTag, cancelled: cancelledTag, categories } = target.tags;
  const categoryTag = categoryId ? categories[categoryId] : undefined;
  // 취소됨 태그를 연결하지 않았으면 마감 태그로 둔다.
  const endedTag = cancelled ? (cancelledTag ?? closedTag) : closedTag;
  const statusTag = closed ? endedTag : open;
  const kindTag = kind === "briefing" ? target.tags.briefing : target.tags.session;
  const adultTag = adultOnly ? target.tags.adult : undefined;
  const { voice, text } = target.tags.playTypes;
  const playTypeTags = playType === "both" ? [voice, text] : [target.tags.playTypes[playType]];
  // 디스코드 포럼 글은 태그를 5개까지만 단다. 넘치면 뒤쪽 플레이 유형 태그가 빠진다.
  return [statusTag, categoryTag, kindTag, adultTag, ...playTypeTags]
    .flatMap((id) => id ?? [])
    .slice(0, 5);
}
