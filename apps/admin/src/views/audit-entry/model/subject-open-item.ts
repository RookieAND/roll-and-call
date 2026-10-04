import { BookOpen, NotebookText, Quote, User, type LucideIcon } from "lucide-react";

import type { AuditSubjectKind } from "@/shared/server";

// 조치 상세 ⋯ 메뉴의 첫 항목(시안 log_detail_menus: 유저, 구인, 후기, 룰북).
export const SUBJECT_OPEN_ITEM: Record<
  AuditSubjectKind,
  { label: string; icon: LucideIcon } | null
> = {
  user: { label: "유저 상세 열기", icon: User },
  game: { label: "구인 상세 열기", icon: NotebookText },
  review: { label: "후기 상세 열기", icon: Quote },
  rulebook: { label: "룰북 상세 열기", icon: BookOpen },
  other: null,
};
