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
  // 실물 · 전자책 · 운영진 인증
  mode: string;
  dates: { label: string; value: string }[];
  // 심사 중처럼 날짜로 적을 수 없는 상태 안내.
  statusNote: string | null;
  badge: { label: string; palette: Palette } | null;
  reason: { label: string; text: string; tone: "warning" | "danger" } | null;
  thumbs: { label: string; url: string; flagged: boolean }[];
  // 반려 사진을 보관 기간이 지나 지웠다.
  deleted: boolean;
  memo: string | null;
  retryHref: string | null;
  // 반려되거나 인증이 취소된 책은 기록째 지울 수 있다.
  discardable: boolean;
}

// 심사 중은 안내 문구로 알리므로 배지를 두지 않는다.
const BADGE: Record<string, NonNullable<BookResult["badge"]>> = {
  [CERT_STATE.certified]: { label: "승인됨", palette: "success" },
  [CERT_STATE.rejected]: { label: "반려됨", palette: "danger" },
  [CERT_STATE.revoked]: { label: "취소됨", palette: "danger" },
};

const DECIDED_LABEL: Record<string, string> = {
  [CERT_STATE.certified]: "승인",
  [CERT_STATE.rejected]: "반려",
  [CERT_STATE.revoked]: "인증 취소",
};

// 신청 상세의 책 한 장. 반려면 사유·문제 사진·운영진 메모와 다시 신청, 취소면 취소 사유와 다시 신청.
export function toBookResult(rulebook: MyRulebook): BookResult {
  const application = rulebook.latestApplication;
  const state = rulebook.state ?? CERT_STATE.pending;
  const day = (at: Date) => toKst(at).format("YYYY.MM.DD");
  const decidedLabel = DECIDED_LABEL[state];
  const dates = [
    ...(application ? [{ label: "신청", value: day(application.createdAt) }] : []),
    ...(decidedLabel && rulebook.stateAt
      ? [{ label: decidedLabel, value: day(rulebook.stateAt) }]
      : []),
  ];
  const rejected = state === CERT_STATE.rejected;
  const revoked = state === CERT_STATE.revoked;
  const ebook = application?.format === CERT_FORMAT.ebook;
  const flagged = (key: string) => application?.flaggedShots.includes(key as never) ?? false;
  const thumbs =
    rejected && application
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
    mode: application ? CERT_FORMAT_LABEL[application.format] : "운영진 인증",
    dates,
    statusNote: state === CERT_STATE.pending ? "운영진이 확인하고 있어요" : null,
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
    memo: rejected ? application?.rejectReason?.trim() || null : null,
    retryHref: rejected || revoked ? certApplyHref([rulebook.id], "photos") : null,
    discardable: rejected || revoked,
  };
}
