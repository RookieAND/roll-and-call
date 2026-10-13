import type { AuditChange } from "#/schema/moderation";

const present = (value: string | null | undefined) => (value?.trim() ? value : undefined);

// 값이 같으면 null이다. 앞은 없고 뒤만 있으면 추가, 반대면 삭제, 둘 다 있으면 변경으로 읽힌다.
export function scalarChange(
  field: string,
  before: string | null | undefined,
  after: string | null | undefined,
): AuditChange | null {
  const previous = present(before);
  const next = present(after);
  if (previous === next) return null;
  return { field, before: previous, after: next };
}

// 목록 칸(다른 이름, 퀴즈 보기)은 순서와 무관하게 늘거나 줄어든 항목만 남긴다. 달라진 게 없으면 null이다.
export function listChange(
  field: string,
  before: readonly string[],
  after: readonly string[],
): AuditChange | null {
  const added = after.filter((item) => !before.includes(item));
  const removed = before.filter((item) => !after.includes(item));
  if (added.length === 0 && removed.length === 0) return null;
  return {
    field,
    ...(added.length > 0 ? { added } : {}),
    ...(removed.length > 0 ? { removed } : {}),
  };
}

// 새로 만든 대상의 칸을 모두 추가로 남길 때 쓴다. 빈 값은 건너뛴다.
export function addedChanges(
  entries: readonly (readonly [field: string, value: string | null | undefined])[],
): AuditChange[] {
  return entries.flatMap(([field, value]) => scalarChange(field, undefined, value) ?? []);
}

// 지운 대상의 칸을 모두 삭제로 남길 때 쓴다. 빈 값은 건너뛴다.
export function removedChanges(
  entries: readonly (readonly [field: string, value: string | null | undefined])[],
): AuditChange[] {
  return entries.flatMap(([field, value]) => scalarChange(field, value, undefined) ?? []);
}

export function compactChanges(changes: readonly (AuditChange | null)[]): AuditChange[] {
  return changes.filter((change): change is AuditChange => change !== null);
}
