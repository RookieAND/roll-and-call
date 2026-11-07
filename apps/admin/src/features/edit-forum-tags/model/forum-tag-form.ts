// 빈 문자열은 연결하지 않음이다. 비면 태그 이름(모집중·마감)으로 찾는다.
export type ForumTagForm = {
  open: string;
  closed: string;
  cancelled: string;
  categories: Record<string, string>;
  // 자작 룰 구인 모두가 쓰는 룰 태그 하나. 자작 룰마다 따로 연결하지 않는다.
  homebrew: string;
  playTypes: { voice: string; text: string };
  briefing: string;
  session: string;
  adult: string;
};

export type ForumTagOptions =
  | { status: "forum"; tags: { id: string; name: string; emoji: string | null }[] }
  | { status: "notForum" }
  | { status: "unreachable" };
