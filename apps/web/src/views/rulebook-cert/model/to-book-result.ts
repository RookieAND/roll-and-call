import {
  CERT_FORMAT,
  CERT_FORMAT_LABEL,
  CERT_PROOF,
  CERT_PROOF_LABEL,
  CERT_PROOFS,
  CERT_SHOT_LABEL,
  CERT_SHOTS,
  CERT_STATE,
  certApplyHref,
  rejectionSummary,
  type MyRulebook,
} from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

type Palette = "success" | "gray" | "warning" | "danger";

export interface BookResult {
  id: string;
  title: string;
  kind: MyRulebook["kind"];
  mode: string;
  dates: { label: string; value: string }[];
  badge: { label: string; palette: Palette } | null;
  reason: { label: string; text: string; tone: "warning" | "danger" } | null;
  thumbs: { label: string; url: string; flagged: boolean }[];
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

export function toBookResult(rulebook: MyRulebook): BookResult {
  const application = rulebook.latestApplication;
  const state = rulebook.state ?? CERT_STATE.pending;
  const day = (at: Date) => toKst(at).format("YYYY.MM.DD");
  const decidedLabel = DECIDED_LABEL[state];
  const memo = application?.rejectReason?.trim() || null;
  // 운영진이 직접 준 인증을 반려로 돌린 기록은 신청한 적이 없어 신청일·사진이 없다.
  const direct = application?.direct ?? false;
  const dates = [
    ...(application && !direct ? [{ label: "신청", value: day(application.createdAt) }] : []),
    ...(decidedLabel && rulebook.stateAt
      ? [{ label: decidedLabel, value: day(rulebook.stateAt) }]
      : []),
  ];
  const rejected = state === CERT_STATE.rejected;
  const revoked = state === CERT_STATE.revoked;
  const ebook = application?.format === CERT_FORMAT.ebook;
  const flagged = (key: string) => application?.flaggedShots.includes(key as never) ?? false;
  const photosKept = rejected || state === CERT_STATE.pending || state === CERT_STATE.certified;
  const thumbs =
    photosKept && application && !direct
      ? ebook
        ? CERT_PROOFS.map((proof) => ({
            label: CERT_PROOF_LABEL[proof],
            url:
              (proof === CERT_PROOF.order
                ? application.purchaseCaptureUrl
                : application.receiptUrl) ?? "",
            flagged: flagged(proof),
          }))
        : CERT_SHOTS.map((shot) => ({
            label: CERT_SHOT_LABEL[shot],
            url: application.photoUrls[shot] ?? "",
            flagged: flagged(shot),
          }))
      : [];
  const kept = thumbs.filter((thumb) => thumb.url);
  return {
    id: rulebook.id,
    title: rulebook.shortName,
    kind: rulebook.kind,
    mode: application && !direct ? CERT_FORMAT_LABEL[application.format] : "운영진 인증",
    dates,
    badge: BADGE[state] ?? null,
    reason: rejected
      ? { label: "반려 사유", text: rejectionSummary(application), tone: "danger" }
      : revoked
        ? {
            label: "인증이 취소됐어요",
            text: rulebook.revokeReason
              ? `사유: ${rulebook.revokeReason}`
              : "운영진이 인증을 취소했습니다",
            tone: "danger",
          }
        : null,
    thumbs: kept.length > 0 ? thumbs : [],
    deleted: rejected && thumbs.length > 0 && kept.length === 0,
    memo: rejected && memo !== rejectionSummary(application) ? memo : null,
    retryHref: rejected || revoked ? certApplyHref([rulebook.id], "photos") : null,
    discardable: rejected || revoked,
  };
}
