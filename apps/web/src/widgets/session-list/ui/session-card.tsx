import { Avatar, Badge, Card, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { CalendarDays, CircleAlert, Clock } from "lucide-react";
import Link from "next/link";

import {
  SESSION_CHIP,
  SESSION_ICON,
  SESSION_TONE,
  type SessionCardModel,
  type SessionIcon,
  type SessionTone,
} from "../model/session-card-model";
import { SessionCardAction } from "./session-card-action";

const TONE_CLASS: Record<SessionTone, string> = {
  [SESSION_TONE.strong]: "font-semibold text-gray-900",
  [SESSION_TONE.muted]: "text-gray-600",
  [SESSION_TONE.warning]: "font-semibold text-warning-600",
  [SESSION_TONE.danger]: "font-semibold text-danger-600",
};

const SCHEDULE_ICON: Record<SessionIcon, typeof Clock> = {
  [SESSION_ICON.calendar]: CalendarDays,
  [SESSION_ICON.clock]: Clock,
  [SESSION_ICON.alert]: CircleAlert,
};

interface SessionCardProps {
  model: SessionCardModel;
}

// 카드에는 지금 필요한 것만 둔다: 제목 + 상태 배지 / 아이콘 + 일정 한 줄 / GM(참여 탭) / 버튼.
export function SessionCard({ model }: SessionCardProps) {
  const ScheduleIcon = SCHEDULE_ICON[model.scheduleIcon];
  const titleForeground = model.titleDanger
    ? "danger"
    : model.chip === SESSION_CHIP.ended
      ? "muted"
      : "normal";

  return (
    <Card.Root
      padding="sm"
      radius={600}
      background="none"
      className={model.urgent ? "border-danger-200 bg-danger-50" : "bg-surface"}
    >
      <VStack gap="100" className="p-025">
        <Link href={`/games/${model.id}`} className="flex flex-col gap-100">
          <HStack align="start" gap="100">
            <Text
              truncate
              typography="heading3"
              foreground={titleForeground}
              className="min-w-0 flex-1"
            >
              {model.title}
            </Text>
            <Badge colorPalette={model.badgeColor}>{model.badge}</Badge>
          </HStack>
          <Text
            typography="body4"
            foreground="inherit"
            render={<p />}
            className={cn("flex items-center gap-075", TONE_CLASS[model.scheduleTone])}
          >
            <ScheduleIcon size={13} strokeWidth={2.2} aria-hidden className="shrink-0" />
            <span className="min-w-0 truncate">{model.schedule}</span>
          </Text>
          {model.gm && (
            <HStack align="center" gap="075">
              <Avatar src={model.gm.avatarUrl} name={model.gm.username} size="sm" />
              <Text typography="body4" foreground="muted" truncate>
                GM {model.gm.username}
              </Text>
            </HStack>
          )}
        </Link>
        <SessionCardAction model={model} />
      </VStack>
    </Card.Root>
  );
}
