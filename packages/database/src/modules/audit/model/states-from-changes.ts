import type { AuditChange, AuditState } from "#db/schema/moderation";

const MAX_LABEL_LENGTH = 60;
const EMPTY_LABEL = "없음";

const clip = (value: string) =>
  value.length > MAX_LABEL_LENGTH ? `${value.slice(0, MAX_LABEL_LENGTH)}…` : value;

const isAddition = (change: AuditChange) =>
  change.before === undefined && !change.removed?.length && Boolean(change.after ?? change.added);
const isRemoval = (change: AuditChange) =>
  change.after === undefined && !change.added?.length && Boolean(change.before ?? change.removed);

// 바뀐 내용만 남긴 조치도 「조치 전후」가 비지 않도록 전후 상태를 만든다.
// 한 칸이면 그 칸의 이전 값과 바뀐 값을, 여러 칸이면 칸 이름을 보여준다.
export function statesFromChanges({
  changes,
  afterLabel,
  target,
}: {
  changes: readonly AuditChange[];
  afterLabel: string;
  target: string;
}): { before: AuditState; after: AuditState } {
  const [only] = changes;
  if (changes.length === 1 && only) {
    return {
      before: {
        label: clip(only.before ?? only.removed?.join(", ") ?? EMPTY_LABEL),
        sub: only.field,
      },
      after: {
        label: clip(only.after ?? only.added?.join(", ") ?? EMPTY_LABEL),
        sub: only.field,
      },
    };
  }
  const fields = changes.map((change) => change.field).join(" · ");
  if (changes.every(isAddition)) {
    return { before: { label: EMPTY_LABEL }, after: { label: afterLabel, sub: target } };
  }
  if (changes.every(isRemoval)) {
    return { before: { label: "있음", sub: fields }, after: { label: afterLabel, sub: target } };
  }
  return {
    before: { label: "바뀌기 전", sub: fields },
    after: { label: afterLabel, sub: fields },
  };
}
