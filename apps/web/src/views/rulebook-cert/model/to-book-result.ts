import {
  CERT_FORMAT_LABEL,
  CERT_STATE,
  certApplyHref,
  rejectionSummary,
  type MyRulebook,
} from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

import { bookReason } from "./book-reason";
import { bookThumbs } from "./book-thumbs";

type Palette = "success" | "gray" | "warning" | "danger";

export interface BookResult {
  id: string;
  title: string;
  kind: MyRulebook["kind"];
  mode: string;
  dates: { label: string; value: string }[];
  badge: { label: string; palette: Palette } | null;
  reason: { label: string; text: string; tone: "warning" | "danger" } | null;
  thumbs: { label: string; src: string | null; flagged: boolean }[];
  deleted: boolean;
  memo: string | null;
  retryHref: string | null;
  discardable: boolean;
}

const BADGE: Record<string, NonNullable<BookResult["badge"]>> = {
  [CERT_STATE.pending]: { label: "심사 중", palette: "gray" },
  [CERT_STATE.certified]: { label: "승인됨", palette: "success" },
  [CERT_STATE.rejected]: { label: "반려됨", palette: "danger" },
  [CERT_STATE.revoked]: { label: "취소됨", palette: "danger" },
};

const DECIDED_LABEL: Record<string, string> = {
  [CERT_STATE.certified]: "승인",
  [CERT_STATE.rejected]: "반려",
  [CERT_STATE.revoked]: "인증 취소",
};

export function toBookResult({
  rulebook,
  signedUrls,
}: {
  rulebook: MyRulebook;
  signedUrls: Map<string, string>;
}): BookResult {
  const application = rulebook.latestApplication;
  const state = rulebook.state ?? CERT_STATE.pending;
  const day = (at: Date) => toKst(at).format("YYYY.MM.DD");
  const decidedLabel = DECIDED_LABEL[state];
  const memo = application?.rejectReason?.trim() || null;
  // 운영진이 직접 준 인증과 그 인증을 반려로 돌린 기록은 신청일·사진을 보이지 않는다.
  // 직접 인증된 책의 latestApplication은 그 전 반려 신청이라 「승인됨」 아래 섞지 않는다.
  const grantedDirectly = state === CERT_STATE.certified && application?.status !== "approved";
  const direct = (application?.direct ?? false) || grantedDirectly;
  const dates = [
    ...(application && !direct ? [{ label: "신청", value: day(application.createdAt) }] : []),
    ...(decidedLabel && rulebook.stateAt
      ? [{ label: decidedLabel, value: day(rulebook.stateAt) }]
      : []),
  ];
  const rejected = state === CERT_STATE.rejected;
  const revoked = state === CERT_STATE.revoked;
  const photosKept = rejected || state === CERT_STATE.pending || state === CERT_STATE.certified;
  const purged = !direct && Boolean(application?.filesPurgedAt);
  const thumbs =
    photosKept && application && !direct ? bookThumbs({ application, signedUrls }) : [];
  const kept = thumbs.filter((thumb) => thumb.src !== null);
  return {
    id: rulebook.id,
    title: rulebook.shortName,
    kind: rulebook.kind,
    mode: application && !direct ? CERT_FORMAT_LABEL[application.format] : "운영진 인증",
    dates,
    badge: BADGE[state] ?? null,
    reason: bookReason(rulebook),
    thumbs: kept.length > 0 ? thumbs : [],
    deleted: purged || (rejected && thumbs.length > 0 && kept.length === 0),
    memo: rejected && memo !== rejectionSummary(application) ? memo : null,
    retryHref:
      rejected || revoked ? certApplyHref({ rulebookIds: [rulebook.id], step: "photos" }) : null,
    discardable: rejected || revoked,
  };
}
