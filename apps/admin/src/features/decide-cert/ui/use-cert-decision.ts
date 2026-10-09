"use client";

import { rejectionSummary } from "@roll-and-call/database/certifications/model";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { toast } from "@roll-and-call/ui";
import { isNull, isUndefined, xor } from "es-toolkit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { EBOOK_REJECT_REASONS, OTHER_REASON, REJECT_REASONS, useActionSubmit } from "@/shared/lib";
import type { CertDecisionResult, CertFormat, ShotKey } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

import { approveCert } from "../api/approve-cert";
import { rejectCert } from "../api/reject-cert";
import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { decisionToastText } from "../model/decision-toast-text";
import { isReviewShotKey } from "../model/is-review-shot-key";
import { rejectMessage } from "../model/reject-message";
import { shotLabels } from "../model/shot-labels";
import { EBOOK_SHOTS, SHOTS, type ReviewShotKey } from "../model/shots";

interface UseCertDecisionOptions {
  applicationId: string;
  applicantNickname: string;
  rulebookId: string;
  rulebookLabel: string;
  format: CertFormat;
  photoUrls: Partial<Record<ReviewShotKey, string>>;
  state: CertReviewState;
  nextHref?: string;
  queueHref: string;
  viewerId: string;
}

export function useCertDecision({
  applicationId,
  applicantNickname,
  rulebookId,
  rulebookLabel,
  format,
  photoUrls,
  state,
  nextHref,
  queueHref,
  viewerId,
}: UseCertDecisionOptions) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const approval = useActionSubmit(approveCert);
  const rejection = useActionSubmit(rejectCert);
  const [checkedShots, setCheckedShots] = useState<ReviewShotKey[]>([]);
  const [flaggedShots, setFlaggedShots] = useState<ShotKey[]>([]);
  const [reason, setReason] = useState("");
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");

  const photoParam = searchParams.get("photo");
  const viewedShot = isReviewShotKey(photoParam) ? photoParam : null;
  const reviewable = state === CERT_REVIEW_STATE.open;
  const rejecting = searchParams.get("mode") === "reject" && reviewable;
  const ebook = format === "ebook";
  const shots = ebook ? EBOOK_SHOTS : SHOTS;
  const pending = approval.pending || rejection.pending;
  const checkableShots: ReviewShotKey[] = reviewable
    ? shots.filter((shot) => photoUrls[shot.key]).map((shot) => shot.key)
    : [];
  const allChecked = checkableShots.every((key) => checkedShots.includes(key));
  const canApprove = reviewable && allChecked && !pending;
  const other = reason === OTHER_REASON;
  const canReject = Boolean(reason && userReason.trim()) && !pending;
  const flaggedLabels = shotLabels(flaggedShots);
  const afterHref = nextHref ?? queueHref;
  const label = `${applicantNickname} · ${rulebookLabel}`;
  const previewPayload = reason
    ? {
        kind: NOTIFICATION_KIND.certRejected,
        params: {
          rulebookId,
          rulebookName: rulebookLabel,
          rejectionSummary: rejectionSummary({
            rejectTag: other ? null : reason,
            flaggedShots,
            rejectReason: userReason,
          }),
        },
      }
    : null;

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    // 서버 데이터가 필요 없는 화면 상태라 주소만 바꾼다(서버 재렌더·서명 URL 재발급 방지).
    window.history.replaceState(null, "", next.size ? `${pathname}?${next}` : pathname);
  };

  const finish = (result: CertDecisionResult | undefined, message: string) => {
    if (isUndefined(result)) return;
    if (!result.ok) {
      const text = decisionToastText({ failure: result, viewerId });
      if (!isNull(text)) toast.info(text);
      router.refresh();
      return;
    }
    toast.success(message);
    router.push(toServerPath(afterHref));
  };

  const approve = async () => {
    finish(await approval.submit(applicationId), `승인했습니다 · ${label}`);
  };

  const reject = async () => {
    finish(
      await rejection.submit(applicationId, {
        reasonTag: other ? null : reason,
        userReason,
        staffMemo,
        flaggedShots,
      }),
      `반려했습니다 · ${label}`,
    );
  };

  const chooseReason = (next: string) => {
    const reasons = ebook ? EBOOK_REJECT_REASONS : REJECT_REASONS;
    const message = reasons.find((candidate) => candidate.name === next)?.message ?? "";
    setReason(next);
    setUserReason(rejectMessage({ text: message, previousShots: [], shots: flaggedLabels }));
  };

  const toggleFlag = (shot: ShotKey) => {
    const nextFlagged = xor(flaggedShots, [shot]);
    setFlaggedShots(nextFlagged);
    if (reason) {
      setUserReason(
        rejectMessage({
          text: userReason,
          previousShots: flaggedLabels,
          shots: shotLabels(nextFlagged),
        }),
      );
    }
  };

  const toggleCheck = (key: ReviewShotKey) => {
    if (!checkableShots.includes(key)) return;
    setCheckedShots(xor(checkedShots, [key]));
  };

  // 확대 창에서 체크하면 다음 사진으로, 마지막 체크 뒤에는 창을 닫고 [승인]에 포커스를 둔다(finalFocus).
  const checkInViewer = (key: ReviewShotKey) => {
    const nextChecked = xor(checkedShots, [key]);
    setCheckedShots(nextChecked);
    if (!nextChecked.includes(key)) return;
    if (checkableShots.every((shot) => nextChecked.includes(shot))) {
      setParam("photo", null);
      return;
    }
    const index = shots.findIndex((shot) => shot.key === key);
    setParam("photo", shots[(index + 1) % shots.length]!.key);
  };

  return {
    ebook,
    shots,
    reviewable,
    rejecting,
    viewedShot,
    pending,
    approving: approval.pending,
    rejectingPending: rejection.pending,
    approvalNetworkError: approval.networkError,
    rejectionNetworkError: rejection.networkError,
    checkedShots,
    checkableShots,
    flaggedShots,
    flaggedLabels,
    allChecked,
    canApprove,
    canReject,
    reason,
    userReason,
    staffMemo,
    previewPayload,
    setUserReason,
    setStaffMemo,
    setParam,
    approve,
    reject,
    chooseReason,
    toggleFlag,
    toggleCheck,
    checkInViewer,
    skip: () => router.push(toServerPath(afterHref)),
  };
}
