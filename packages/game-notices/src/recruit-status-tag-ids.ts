import type { RecruitTarget } from "./recruit-target";

// 모집 상태 태그와 룰 분류 태그. 포럼에 없거나 연결하지 않은 것은 빠진다.
export function recruitStatusTagIds({
  target,
  closed,
  categoryId,
}: {
  target: RecruitTarget;
  closed: boolean;
  categoryId: string | null;
}) {
  const { open, closed: closedTag, categories } = target.tags;
  const categoryTag = categoryId ? categories[categoryId] : undefined;
  return [closed ? closedTag : open, categoryTag].flatMap((id) => id ?? []);
}
