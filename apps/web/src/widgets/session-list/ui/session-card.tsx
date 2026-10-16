import { Avatar, Badge, Card, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { CalendarDays, CircleAlert, Clock } from "lucide-react";

import { GameThumbnail } from "@/entities/game";
import { ReopenGameLink } from "@/features/reopen-game";
import { ServerLink } from "@/shared/ui";

import {
  SESSION_CHIP,
  SESSION_ICON,
  SESSION_TONE,
  type SessionCardModel,
  type SessionIcon,
  type SessionTone,
} from "../model/session-card-model";
import { sessionTitleForeground } from "../model/session-title-foreground";
import { HiddenSessionCard } from "./hidden-session-card";
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

export function SessionCard({ model }: SessionCardProps) {
  if (model.hidden) return <HiddenSessionCard />;

  const ScheduleIcon = SCHEDULE_ICON[model.scheduleIcon];
  const titleForeground =
    model.cancelled && !model.titleDanger ? "muted" : sessionTitleForeground(model);

  const captionForeground = model.caption?.strong ? "primary" : "hint";
  const captionWeight = model.caption?.strong ? "bold" : "regular";

  return (
    <Card.Root
      padding="sm"
      radius={600}
      background="none"
      className={cn(
        "desktop:flex desktop:h-full desktop:flex-col desktop:overflow-hidden desktop:p-0",
        model.urgent ? "border-danger-200 bg-danger-50" : "bg-surface",
      )}
    >
      {/* 1100px 이상: 위 16:9 썸네일. 끝났거나 취소된 세션은 흑백이고, 스포일러는 회색 칸이다. */}
      {model.thumbnailSpoiler ? (
        <span className="hidden aspect-video w-full flex-none bg-gray-100 desktop:block" />
      ) : (
        <GameThumbnail
          url={model.thumbnailUrl}
          sizes="412px"
          className={cn(
            "hidden aspect-video w-full flex-none desktop:block",
            (model.cancelled || model.chip === SESSION_CHIP.ended) && "grayscale",
          )}
        />
      )}
      <VStack
        gap={model.chip === SESSION_CHIP.ended ? "075" : "100"}
        className="p-025 desktop:flex-1 desktop:px-175 desktop:pt-175 desktop:pb-175"
      >
        <ServerLink path={`/games/${model.id}`} className="flex flex-col gap-100 desktop:flex-1">
          {/* 데스크톱은 배지 줄이 제목 위로 올라간다: 줄바꿈 + order로 순서만 바꾼다. */}
          <HStack align="start" gap="100" className="desktop:flex-wrap desktop:gap-075">
            <Text
              truncate
              typography="heading3"
              foreground={titleForeground}
              className="min-w-0 flex-1 desktop:order-2 desktop:min-h-11 desktop:basis-full desktop:overflow-visible desktop:text-clip desktop:whitespace-normal desktop:text-pretty"
            >
              {model.title}
            </Text>
            <Badge colorPalette={model.badgeColor} className="desktop:order-1">
              {model.badge}
            </Badge>
          </HStack>
          <Text
            typography="body4"
            foreground="inherit"
            render={<p />}
            className={cn(
              "flex items-center gap-075",
              model.cancelled ? "text-gray-600" : TONE_CLASS[model.scheduleTone],
            )}
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
          {model.caption && (
            <Text
              typography="body4"
              foreground={captionForeground}
              weight={captionWeight}
              numeric
              render={<p />}
            >
              {model.caption.text}
            </Text>
          )}
        </ServerLink>
        {(model.action || model.canReopen) && (
          <HStack gap="100" className="mt-050 [&>*]:mt-0 [&>*]:min-w-0 *:flex-1">
            <SessionCardAction model={model} />
            {model.canReopen && (
              <ReopenGameLink
                gameId={model.id}
                variant={model.action ? "outline" : "solid"}
                size="md"
              />
            )}
          </HStack>
        )}
      </VStack>
    </Card.Root>
  );
}
