import { Badge, Card, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { CalendarDays, CircleAlert } from "lucide-react";

import { GameCapacity, GameThumbnail } from "@/entities/game";
import { ReopenGameLink } from "@/features/reopen-game";
import { ServerLink } from "@/shared/ui";

import {
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  type SessionCardModel,
} from "../model/session-card-model";
import { HiddenSessionCard } from "./hidden-session-card";
import { SessionCardAction } from "./session-card-action";

interface SessionCardProps {
  model: SessionCardModel;
}

export function SessionCard({ model }: SessionCardProps) {
  if (model.hidden) return <HiddenSessionCard />;
  const content = model.content;
  const past = model.chip === SESSION_CHIP.ended;
  const primary = content ? content.primaryAction : model.action;
  const notice = content ? content.notice : model.scheduleNote;
  const secondary =
    !model.canReopen && model.action && model.action.href !== primary?.href ? model.action : null;

  return (
    <Card.Root
      padding="none"
      radius={600}
      className={cn(
        "flex h-full flex-col overflow-hidden bg-surface",
        model.urgent && "border-danger-200",
      )}
    >
      <ServerLink path={`/games/${model.id}`} className="block">
        {model.thumbnailSpoiler ? (
          <span className="block aspect-video w-full bg-gray-100" />
        ) : (
          <GameThumbnail
            url={model.thumbnailUrl}
            sizes="(max-width: 640px) 100vw, 480px"
            className={cn("aspect-video w-full", past && "grayscale")}
          />
        )}
      </ServerLink>
      <div className="flex items-start gap-075 px-175 pt-175">
        <ServerLink
          path={`/games/${model.id}`}
          className="min-w-0 flex-1 rounded-300 focus-visible:outline-2 focus-visible:outline-tinted-ink"
        >
          <VStack gap="050" className="min-w-0 flex-1">
            <HStack align="center" gap="050" className="flex-wrap">
              {model.isPrivate && <Badge colorPalette="gray">지정 모집</Badge>}
              <Badge colorPalette={model.badgeColor}>{model.badge}</Badge>
              {primary?.badge && (
                <Badge colorPalette="primary" className="tabular-nums">
                  {primary.kind === SESSION_ACTION_KIND.writeReview
                    ? `후기 ${primary.badge}`
                    : primary.badge}
                </Badge>
              )}
            </HStack>
            <Text
              typography="heading3"
              foreground={past ? "muted" : "normal"}
              className="line-clamp-2 break-keep"
            >
              {model.title}
            </Text>
            <Text typography="body4" foreground="muted" className="line-clamp-2 break-keep">
              {content?.rule}
              {content?.rule && model.gm && " · "}
              {model.gm && `GM ${model.gm.username}`}
            </Text>
          </VStack>
        </ServerLink>
      </div>

      <ServerLink
        path={`/games/${model.id}`}
        className={cn(
          "mx-175 mt-150 flex flex-wrap items-center gap-x-150 gap-y-075 rounded-200",
          notice ? "mb-075" : "mb-175",
        )}
      >
        <HStack align="center" gap="075" className="min-w-0 flex-1">
          <CalendarDays size={14} aria-hidden className="shrink-0 text-hint" />
          <Text
            typography="body3"
            foreground={past ? "muted" : "normal"}
            weight="medium"
            className="min-w-0 break-keep"
          >
            {content?.calendar ?? model.schedule}
          </Text>
        </HStack>
        {content && <GameCapacity {...content.capacity} />}
      </ServerLink>

      {notice && (
        <HStack align="start" gap="075" className="mx-175 mb-150">
          {model.urgent && (
            <CircleAlert size={14} aria-hidden className="mt-025 shrink-0 text-danger-600" />
          )}
          <Text
            typography="body4"
            foreground={model.urgent ? "danger" : "muted"}
            className="break-keep"
          >
            {notice}
          </Text>
        </HStack>
      )}
      <div className="mt-auto">
        {(primary || secondary || model.canReopen) && (
          <div
            className={cn(
              "grid gap-100 border-t border-gray-200 px-175 py-150 *:min-w-0",
              primary &&
                (secondary || model.canReopen) &&
                "grid-cols-2 [&>[data-slot=button]]:px-125",
            )}
          >
            {primary && <SessionCardAction model={{ ...model, action: primary }} />}
            {secondary && <SessionCardAction model={{ ...model, action: secondary }} />}
            {model.canReopen && (
              <ReopenGameLink
                gameId={model.id}
                size="lg"
                variant="outline"
                colorPalette="primary"
              />
            )}
          </div>
        )}
      </div>
    </Card.Root>
  );
}
