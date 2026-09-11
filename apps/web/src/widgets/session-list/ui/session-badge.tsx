"use client";

import { Badge, cn } from "@trpg/ui";
import { dday } from "@/shared/lib";
import type { SessionBadgeModel } from "../model/session-card";

// 배지는 "언제"만 말한다. D-N은 사용자 타임존 기준으로 클라이언트에서 계산.
const BASE = "rounded-md px-2 py-1";
const TONE = {
  session: "bg-success-100 text-success-700", // 확정: 초록
  deadline: "bg-gray-100 text-gray-600", // 모집 마감: 회색
  urgent: "bg-danger-100 text-danger-600", // 마감 24h 이내: 빨강
} as const;

export function SessionBadge({ badge }: { badge: SessionBadgeModel }) {
  if (badge.kind === "none") return null;
  if (badge.kind === "waiting") {
    return <Badge className={cn(BASE, TONE.deadline)}>{badge.label}</Badge>;
  }
  if (badge.kind === "session") {
    return <Badge className={cn(BASE, TONE.session)}>D-{dday(badge.target)}</Badge>;
  }
  const tone = badge.urgent ? TONE.urgent : TONE.deadline;
  return <Badge className={cn(BASE, tone)}>마감 D-{dday(badge.target)}</Badge>;
}
