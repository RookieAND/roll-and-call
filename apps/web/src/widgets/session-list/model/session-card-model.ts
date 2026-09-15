import type { ParticipantStatus, SessionRole } from "@/entities/game";
import type { Game } from "@/shared/server";

export const SESSION_BUCKET = {
  joined: "joined",
  hosted: "hosted",
  past: "past",
} as const;

export type SessionBucket = (typeof SESSION_BUCKET)[keyof typeof SESSION_BUCKET];

export const SESSION_CHIP = {
  scheduling: "scheduling",
  confirmed: "confirmed",
  waiting: "waiting",
  recruiting: "recruiting",
} as const;

export type SessionChip = (typeof SESSION_CHIP)[keyof typeof SESSION_CHIP];

export const SESSION_TONE = {
  normal: "normal",
  success: "success",
  warning: "warning",
  hint: "hint",
} as const;

export type SessionTone = (typeof SESSION_TONE)[keyof typeof SESSION_TONE];

export const SESSION_ACTION_KIND = {
  confirmTime: "confirm-time",
  submitAvailability: "submit-availability",
} as const;

export type SessionActionKind = (typeof SESSION_ACTION_KIND)[keyof typeof SESSION_ACTION_KIND];

export type SessionAction = {
  kind: SessionActionKind;
  label: string;
  href: string;
};

export type SessionCardModel = {
  id: string;
  title: string;
  round: number;
  role: SessionRole;
  bucket: SessionBucket;
  chip: SessionChip | null;
  badge: string;
  badgeColor: "primary" | "success" | "gray";
  schedule: string;
  scheduleTone: SessionTone;
  meta: string;
  urgent: boolean;
  action: SessionAction | null;
  startsAt: string | null;
  sortKey: number;
};

type SessionParticipant = {
  userId: string;
  status: ParticipantStatus;
  joinedAt: Date | string;
};

export type SessionGame = Game & {
  gm: { username: string } | null;
  participants: SessionParticipant[];
};

export type SessionContext = {
  viewerId: string;
  respondedGameIds: ReadonlySet<string>;
  responseCounts: ReadonlyMap<string, number>;
  now?: Date;
};

export type MySessions = Record<SessionBucket, SessionCardModel[]>;
