import { BookOpen, FileText } from "lucide-react";

// 처리 대기 2종(D212). 인증은 가장 오래 기다린 신청의 심사 상세를 바로 연다(D193).
export const PENDING_COPY = {
  cert: {
    label: "룰북 인증 심사",
    href: (oldestId: string | null) => (oldestId ? `/cert/${oldestId}` : "/cert"),
    icon: BookOpen,
    shortcut: "C",
    homeSub: (days: number) => `가장 오래된 신청이 ${days}일째 심사를 기다리고 있습니다`,
    paletteMeta: (count: number, days: number) =>
      `${count}건 대기 · 가장 오래된 신청은 ${days}일째 기다리고 있습니다`,
  },
  rulebookRequest: {
    label: "룰북 추가 요청",
    href: () => "/rules?tab=requests",
    icon: FileText,
    shortcut: "B",
    homeSub: (days: number) => `가장 오래된 요청이 ${days}일째 처리를 기다리고 있습니다`,
    paletteMeta: (count: number, days: number) =>
      `${count}건 · 가장 오래된 요청은 ${days}일째 기다리고 있습니다`,
  },
} as const;
