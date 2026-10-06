import type { RecruitTarget } from "./recruit-target";

// 모집 상태 태그와 룰 분류 태그. 포럼에 없거나 연결하지 않은 것은 빠진다.
export function recruitStatusTagIds({
  target,
  closed,
  cancelled = false,
  categoryId,
}: {
  target: RecruitTarget;
  closed: boolean;
  cancelled?: boolean;
  categoryId: string | null;
}) {
  const { open, closed: closedTag, cancelled: cancelledTag, categories } = target.tags;
  const categoryTag = categoryId ? categories[categoryId] : undefined;
  // 취소됨 태그를 연결하지 않았으면 마감 태그로 둔다.
  const endedTag = cancelled ? (cancelledTag ?? closedTag) : closedTag;
  const statusTag = closed ? endedTag : open;
  return [statusTag, categoryTag].flatMap((id) => id ?? []);
}
