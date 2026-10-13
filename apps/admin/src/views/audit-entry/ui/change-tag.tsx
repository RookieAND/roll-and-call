import { Tag } from "@/shared/ui";

import type { ChangeKind } from "../model/change-kind";

const CHANGE_TAG = {
  added: { label: "추가", tone: "success" },
  removed: { label: "삭제", tone: "danger" },
  changed: { label: "변경", tone: "primary" },
} as const satisfies Record<ChangeKind, { label: string; tone: "success" | "danger" | "primary" }>;

interface ChangeTagProps {
  kind: ChangeKind;
}

export function ChangeTag({ kind }: ChangeTagProps) {
  const { label, tone } = CHANGE_TAG[kind];
  return <Tag tone={tone}>{label}</Tag>;
}
