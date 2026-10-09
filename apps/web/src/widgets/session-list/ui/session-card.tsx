import { Avatar, Badge, Card, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { CalendarDays, CircleAlert, Clock } from "lucide-react";

import { ReopenGameLink } from "@/features/reopen-game";
import { ServerLink } from "@/shared/ui";

import {
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
  const titleForeground = sessionTitleForeground(model);

  const captionForeground = model.caption?.strong ? "primary" : "hint";
  const captionWeight = model.caption?.strong ? "bold" : "regular";

  return (
    <Card.Root
      padding="sm"
      radius={600}
      background="none"
      className={cn(
        model.urgent ? "border-danger-200 bg-danger-50" : "bg-surface",
        model.cancelled && "opacity-72",
      )}
    >
      <VStack gap="100" className="p-025">
        <ServerLink path={`/games/${model.id}`} className="flex flex-col gap-100">
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
              <ReopenGameLink gameId={model.id} variant="solid" size="md" label="다시 열기" />
            )}
          </HStack>
        )}
      </VStack>
    </Card.Root>
  );
}
