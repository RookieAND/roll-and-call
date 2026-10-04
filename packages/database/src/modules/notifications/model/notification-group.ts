import { NOTIFICATION_KIND, type NotificationKind } from "./notification-kind";

export const NOTIFICATION_GROUP = {
  game: "game",
  cert: "cert",
  review: "review",
  account: "account",
} as const;

export type NotificationGroup = (typeof NOTIFICATION_GROUP)[keyof typeof NOTIFICATION_GROUP];

const CERT_KINDS: readonly NotificationKind[] = [
  NOTIFICATION_KIND.certApproved,
  NOTIFICATION_KIND.certRejected,
  NOTIFICATION_KIND.certRevoked,
  NOTIFICATION_KIND.certGranted,
  NOTIFICATION_KIND.rulebookRequestAdded,
  NOTIFICATION_KIND.rulebookRequestDeclined,
];

const REVIEW_KINDS: readonly NotificationKind[] = [
  NOTIFICATION_KIND.reviewAvailable,
  NOTIFICATION_KIND.reviewHidden,
  NOTIFICATION_KIND.reviewUnhidden,
  NOTIFICATION_KIND.reviewDeleted,
];

const ACCOUNT_KINDS: readonly NotificationKind[] = [
  NOTIFICATION_KIND.sanctioned,
  NOTIFICATION_KIND.sanctionReleased,
  NOTIFICATION_KIND.nicknameChanged,
  NOTIFICATION_KIND.staffAdded,
  NOTIFICATION_KIND.staffRemoved,
  NOTIFICATION_KIND.badgeEarned,
  NOTIFICATION_KIND.hiddenTitleEarned,
  NOTIFICATION_KIND.monthlyAward,
];

export function notificationGroup(kind: NotificationKind): NotificationGroup {
  if (CERT_KINDS.includes(kind)) return NOTIFICATION_GROUP.cert;
  if (REVIEW_KINDS.includes(kind)) return NOTIFICATION_GROUP.review;
  if (ACCOUNT_KINDS.includes(kind)) return NOTIFICATION_GROUP.account;
  return NOTIFICATION_GROUP.game;
}
