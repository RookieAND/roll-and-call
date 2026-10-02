import { BookOpen, FileText, Flag, Quote } from "lucide-react";

export const PENDING_COPY = {
  cert: {
    label: "룰북 인증 심사",
    href: "/cert",
    icon: BookOpen,
    shortcut: "C",
    homeSub: (days: number) => `가장 오래된 신청이 ${days}일째 심사를 기다리고 있습니다`,
    paletteMeta: (count: number, days: number) =>
      `${count}건 대기 · 가장 오래된 신청은 ${days}일째 기다리고 있습니다`,
  },
  rulebookRequest: {
    label: "룰북 추가 요청",
    href: "/platform/catalog?tab=requests",
    icon: FileText,
    shortcut: "B",
    homeSub: (days: number) => `가장 오래된 요청이 ${days}일째 처리를 기다리고 있습니다`,
    paletteMeta: (count: number, days: number) =>
      `${count}건 · 가장 오래된 요청은 ${days}일째 기다리고 있습니다`,
  },
  report: {
    label: "신고된 구인",
    href: "/posts?filter=reported",
    icon: Flag,
    shortcut: "P",
    homeSub: (days: number) => `가장 오래된 신고가 ${days}일째 처리되지 않았습니다`,
    paletteMeta: (count: number, days: number) =>
      `${count}건 · 가장 오래된 신고는 ${days}일째 처리되지 않았습니다`,
  },
  reviewReport: {
    label: "신고된 후기",
    href: "/posts/reviews",
    icon: Quote,
    shortcut: "R",
    homeSub: (days: number) => `가장 오래된 신고가 ${days}일째 처리되지 않았습니다`,
    paletteMeta: (count: number, days: number) =>
      `${count}건 · 가장 오래된 신고는 ${days}일째 처리되지 않았습니다`,
  },
} as const;
