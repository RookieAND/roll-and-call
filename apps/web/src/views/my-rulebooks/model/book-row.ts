import type { MyRulebook } from "@/entities/rulebook";

export const BOOK_ROW = {
  certified: "certified",
  unlocked: "unlocked",
  pending: "pending",
  rejected: "rejected",
  revoked: "revoked",
  // 세트를 채우려면 필요한데 아직 안 낸 기본 룰북, GM 세트를 가진 뒤 더 낼 수 있는 서플리먼트.
  missing: "missing",
  add: "add",
} as const;

export type BookRowType = (typeof BOOK_ROW)[keyof typeof BOOK_ROW];

export interface BookRow {
  rulebook: MyRulebook;
  type: BookRowType;
  meta: string;
}

export interface CategoryCard {
  id: string;
  name: string;
  badge: { label: string; palette: "success" | "gray" | "warning" };
  summary: string;
  // 세트를 채우라는 안내와 한 번에 신청할 책들.
  cta: { text: string; button: string; rulebookIds: string[] } | null;
  rows: BookRow[];
  gmReady: boolean;
  rejected: boolean;
  at: Date;
}
