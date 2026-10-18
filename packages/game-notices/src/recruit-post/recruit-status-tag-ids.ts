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
}: {
  target: RecruitTarget;
  closed: boolean;
  cancelled?: boolean;
  categoryId: string | null;
  kind: GameKind;
  playType: PlayType;
}) {
  const { open, closed: closedTag, cancelled: cancelledTag, categories } = target.tags;
  const categoryTag = categoryId ? categories[categoryId] : undefined;
  // 취소됨 태그를 연결하지 않았으면 마감 태그로 둔다.
  const endedTag = cancelled ? (cancelledTag ?? closedTag) : closedTag;
  const statusTag = closed ? endedTag : open;
  const kindTag = kind === "briefing" ? target.tags.briefing : target.tags.session;
  return [statusTag, categoryTag, target.tags.playTypes[playType], kindTag].flatMap(
    (id) => id ?? [],
  );
}
