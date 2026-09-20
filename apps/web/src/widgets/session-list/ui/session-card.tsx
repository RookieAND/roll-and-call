import { Badge, HStack, Text, cn } from "@trpg/ui";
import Link from "next/link";

import {
  SESSION_CHIP,
  SESSION_TONE,
  type SessionCardModel,
  type SessionTone,
} from "../model/session-card-model";
import { SessionCardAction } from "./session-card-action";

const TONE_CLASS: Record<SessionTone, string> = {
  [SESSION_TONE.normal]: "text-gray-600",
  [SESSION_TONE.success]: "font-semibold text-success-700",
  [SESSION_TONE.warning]: "font-semibold text-warning-600",
  [SESSION_TONE.hint]: "text-hint",
};

export function SessionCard({ model, eyebrow }: { model: SessionCardModel; eyebrow?: string }) {
  const cardClass = model.urgent
    ? "border-[1.5px] border-danger-300 bg-danger-50"
    : "border border-gray-200";
  const titleForeground = model.chip === SESSION_CHIP.ended ? "muted" : "normal";

  return (
    <div className={cn("rounded-[14px] p-3.5", cardClass)}>
      <Link href={`/games/${model.id}`} className="block">
        {eyebrow && (
          <Text typography="body4" className="mb-1 block font-bold text-warning-600">
            {eyebrow}
          </Text>
        )}
        <HStack justify="between" align="center" gap={2}>
          <Text typography="subtitle1" foreground={titleForeground} className="min-w-0 truncate">
            {model.title}
          </Text>
          <Badge color={model.badgeColor} className="shrink-0">
            {model.badge}
          </Badge>
        </HStack>
        <Text
          typography="body3"
          className={cn("mt-1 block truncate", TONE_CLASS[model.scheduleTone])}
        >
          {model.schedule}
        </Text>
        <Text typography="body4" foreground="hint" className="mt-0.5 block truncate">
          {model.meta}
        </Text>
        {model.note && (
          <Text
            typography="body4"
            foreground="hint"
            render={<p />}
            className="mt-2.5 border-t border-gray-100 pt-2.5 leading-relaxed whitespace-pre-line"
          >
            {model.note}
          </Text>
        )}
      </Link>
      <SessionCardAction model={model} />
    </div>
  );
}
