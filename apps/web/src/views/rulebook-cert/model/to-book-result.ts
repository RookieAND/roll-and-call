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
  meta: string;
  badge: { label: string; palette: Palette };
  reason: { label: string; text: string; tone: "warning" | "danger" } | null;
  thumbs: { label: string; url: string; flagged: boolean }[];
  // 반려 사진을 보관 기간이 지나 지웠다.
  deleted: boolean;
  memo: string | null;
  retryHref: string | null;
}

const BADGE: Record<string, BookResult["badge"]> = {
  [CERT_STATE.certified]: { label: "승인됨", palette: "success" },
  [CERT_STATE.pending]: { label: "심사 중", palette: "gray" },
  [CERT_STATE.rejected]: { label: "반려됨", palette: "danger" },
  [CERT_STATE.revoked]: { label: "취소됨", palette: "danger" },
};

// 신청 상세의 책 한 장. 반려면 사유·문제 사진·운영진 메모와 다시 신청, 취소면 취소 사유와 다시 신청.
export function toBookResult(rulebook: MyRulebook): BookResult {
  const application = rulebook.latestApplication;
  const state = rulebook.state ?? CERT_STATE.pending;
  const day = (at: Date | null | undefined) => (at ? toKst(at).format("MM.DD") : "");
  const format = application ? CERT_FORMAT_LABEL[application.format] : "운영진 인증";
  const stateMeta = {
    [CERT_STATE.certified]: `${day(rulebook.stateAt)} 승인`,
    [CERT_STATE.pending]: "운영진이 확인하고 있습니다",
    [CERT_STATE.rejected]: `${day(rulebook.stateAt)} 반려`,
    [CERT_STATE.revoked]: `${day(rulebook.stateAt)} 인증 취소`,
    [CERT_STATE.requested]: "",
  }[state];
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
    meta: [format, stateMeta].filter(Boolean).join(" · "),
    badge: BADGE[state] ?? BADGE[CERT_STATE.pending]!,
    reason: rejected
      ? { label: "반려 사유", text: rejectionSummary(application), tone: "danger" }
      : revoked
        ? {
            label: "인증이 취소됐습니다",
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
  };
}
