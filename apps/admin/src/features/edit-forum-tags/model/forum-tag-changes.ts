import type { ForumTagMap } from "@roll-and-call/database";
import { compactChanges, scalarChange } from "@roll-and-call/database/moderation/model";

const STATUS_ROWS = [
  { key: "open", label: "모집중" },
  { key: "closed", label: "마감" },
  { key: "cancelled", label: "취소됨" },
] as const;
const PLAY_TYPE_ROWS = [
  { key: "voice", label: "보이스" },
  { key: "text", label: "텍스트" },
] as const;
const KIND_ROWS = [
  { key: "briefing", label: "설명회" },
  { key: "session", label: "세션" },
] as const;

interface ForumTagChangesInput {
  before: ForumTagMap | null;
  after: ForumTagMap | null;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}

// 연결한 태그는 이름으로 남긴다. 포럼에서 지워져 이름을 모르면 「삭제된 태그」다.
export function forumTagChanges({ before, after, categories, tags }: ForumTagChangesInput) {
  const nameOf = (id: string | undefined) =>
    id ? (tags.find((tag) => tag.id === id)?.name ?? "삭제된 태그") : undefined;
  const rows = [
    ...STATUS_ROWS.map(({ key, label }) => ({ label, before: before?.[key], after: after?.[key] })),
    ...categories.map(({ id, name }) => ({
      label: name,
      before: before?.categories?.[id],
      after: after?.categories?.[id],
    })),
    ...PLAY_TYPE_ROWS.map(({ key, label }) => ({
      label,
      before: before?.playTypes?.[key],
      after: after?.playTypes?.[key],
    })),
    ...KIND_ROWS.map(({ key, label }) => ({ label, before: before?.[key], after: after?.[key] })),
  ];
  return compactChanges(
    rows.map((row) => scalarChange(row.label, nameOf(row.before), nameOf(row.after))),
  );
}
