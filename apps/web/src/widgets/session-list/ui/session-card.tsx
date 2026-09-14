import { Badge, Button, HStack, Text, cn } from "@trpg/ui";
import Link from "next/link";
import { GameRoundBadge } from "@/entities/game";
import type { SessionCardModel, SessionTone } from "../model/session-card";

const TONE_CLASS: Record<SessionTone, string> = {
  normal: "text-gray-600",
  success: "font-semibold text-success-700",
  warning: "font-semibold text-warning-600",
  hint: "text-hint",
};

// 세션 카드: 제목·배지 → 일정 한 줄 → 룰·GM·인원. 카드 목적지는 항상 구인 상세이고,
// 할 일(일정 조율·세션 시간 확정)은 카드 안 버튼으로만 간다. eyebrow는 홈 할 일의 이유 한 줄.
export function SessionCard({ model, eyebrow }: { model: SessionCardModel; eyebrow?: string }) {
  const cardClass = model.urgent
    ? "border-[1.5px] border-danger-300 bg-danger-50"
    : "border border-gray-200";
  const titleForeground = model.bucket === "past" ? "muted" : "normal";
  const actionVariant = model.action?.kind === "confirm-time" ? "solid" : "tinted";

  return (
    <div className={cn("rounded-[14px] p-3.5", cardClass)}>
      <Link href={`/games/${model.id}`} className="block">
        {eyebrow && (
          <Text typography="body4" className="mb-1 block font-bold text-warning-600">
            {eyebrow}
          </Text>
        )}
        <HStack justify="between" align="center" gap={2}>
          <HStack align="center" gap={2} className="min-w-0">
            <GameRoundBadge round={model.round} />
            <Text typography="subtitle1" foreground={titleForeground} className="truncate">
              {model.title}
            </Text>
          </HStack>
          <Badge color={model.badgeColor} className="shrink-0">
            {model.badge}
          </Badge>
        </HStack>
        <Text typography="body3" className={cn("mt-1 block truncate", TONE_CLASS[model.scheduleTone])}>
          {model.schedule}
        </Text>
        <Text typography="body4" foreground="hint" className="mt-0.5 block truncate">
          {model.meta}
        </Text>
      </Link>
      {model.action && (
        <Button asChild variant={actionVariant} className="mt-2.5 h-10 w-full">
          <Link href={model.action.href}>{model.action.label}</Link>
        </Button>
      )}
    </div>
  );
}
