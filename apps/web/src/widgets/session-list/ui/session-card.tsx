import { Badge, HStack, Text, cn } from "@trpg/ui";
import { Check, CircleAlert } from "lucide-react";
import Link from "next/link";

import {
  SESSION_CHIP,
  SESSION_TONE,
  type SessionCardModel,
  type SessionTone,
} from "../model/session-card-model";
import { SessionCardAction } from "./session-card-action";
import { SessionEyebrow } from "./session-eyebrow";
import { UrgentSessionEyebrow } from "./urgent-session-eyebrow";

const TONE_CLASS: Record<SessionTone, string> = {
  [SESSION_TONE.normal]: "text-gray-600",
  [SESSION_TONE.success]: "font-bold text-success-700",
  [SESSION_TONE.warning]: "font-semibold text-warning-600",
  [SESSION_TONE.hint]: "text-hint",
};

const TONE_ICON: Record<SessionTone, typeof Check | null> = {
  [SESSION_TONE.normal]: null,
  [SESSION_TONE.success]: Check,
  [SESSION_TONE.warning]: CircleAlert,
  [SESSION_TONE.hint]: null,
};

interface SessionCardProps {
  model: SessionCardModel;
  eyebrow?: string;
}

export function SessionCard({ model, eyebrow }: SessionCardProps) {
  const cardClass = model.urgent
    ? "border-[1.5px] border-danger-300 bg-danger-50"
    : "border border-gray-200";
  const titleForeground = model.chip === SESSION_CHIP.ended ? "muted" : "normal";
  const ScheduleIcon = TONE_ICON[model.scheduleTone];
  const Eyebrow = model.urgent ? UrgentSessionEyebrow : SessionEyebrow;

  return (
    <div className={cn("rounded-600 p-175", cardClass)}>
      <Link href={`/games/${model.id}`} className="block">
        {eyebrow && <Eyebrow label={eyebrow} />}
        <HStack justify="between" align="center" gap="100">
          <Text truncate typography="heading3" foreground={titleForeground} className="min-w-0">
            {model.title}
          </Text>
          <Badge color={model.badgeColor} className="shrink-0">
            {model.badge}
          </Badge>
        </HStack>
        <HStack align="center" gap="100" className={cn("mt-100", TONE_CLASS[model.scheduleTone])}>
          {ScheduleIcon && (
            <ScheduleIcon size={13} strokeWidth={2.2} aria-hidden className="shrink-0" />
          )}
          <Text truncate typography="body4" foreground="inherit" className="min-w-0">
            {model.schedule}
          </Text>
        </HStack>
        <Text truncate typography="body4" foreground="muted" className="mt-075">
          {model.meta}
        </Text>
        {model.note && (
          <Text
            typography="body4"
            foreground="hint"
            render={<p />}
            className="mt-125 border-t border-gray-100 pt-125 leading-relaxed whitespace-pre-line"
          >
            {model.note}
          </Text>
        )}
      </Link>
      <SessionCardAction model={model} />
    </div>
  );
}
