import type { StatusTone } from "@/shared/lib";

interface DescribeStatusInput {
  row: { value: string; savedValue: string };
  deleted: boolean;
  optional: boolean;
}

export function describeStatus({ row, deleted, optional }: DescribeStatusInput): {
  label: string;
  tone: StatusTone;
} {
  if (deleted) return { label: "태그 삭제됨", tone: "warning" };
  if (!row.value) return { label: optional ? "연결 안 됨" : "연결 안 함", tone: "gray" };
  if (row.value === row.savedValue) return { label: "연결됨", tone: "success" };
  return { label: "변경됨", tone: "primary" };
}
