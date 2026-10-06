import type { ForumTagMap } from "@roll-and-call/database";

export const RECRUIT_TAG_NAME = { open: "모집중", closed: "마감", cancelled: "취소됨" } as const;

export type RecruitTags = {
  open?: string;
  closed?: string;
  cancelled?: string;
  categories: Record<string, string>;
  // 봇이 붙이고 떼는 태그 전부. 운영진이 직접 단 다른 태그는 건드리지 않는다.
  managed: string[];
};

const withoutSpaces = (name: string) => name.replaceAll(/\s/g, "");

// 어드민에서 고른 태그 id를 먼저 쓴다. 관리자가 태그를 지우고 다시 만들어 id가 사라졌으면 이름으로 찾고, 그래도 없으면 비운다.
export function resolveRecruitTags({
  saved,
  available,
}: {
  saved: ForumTagMap | null;
  available: { id: string; name: string }[];
}): RecruitTags {
  const exists = (id: string | undefined) => available.some((tag) => tag.id === id);
  const idOf = (key: keyof typeof RECRUIT_TAG_NAME) => {
    const savedId = saved?.[key];
    if (exists(savedId)) return savedId;
    return available.find((tag) => withoutSpaces(tag.name) === RECRUIT_TAG_NAME[key])?.id;
  };
  const open = idOf("open");
  const closed = idOf("closed");
  const cancelled = idOf("cancelled");
  const categories = Object.fromEntries(
    Object.entries(saved?.categories ?? {}).filter(([, tagId]) => exists(tagId)),
  );
  return {
    open,
    closed,
    cancelled,
    categories,
    managed: [
      ...new Set([open, closed, cancelled, ...Object.values(categories)].flatMap((id) => id ?? [])),
    ],
  };
}
