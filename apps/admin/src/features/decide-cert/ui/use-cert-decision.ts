"use client";

import { rejectionSummary } from "@roll-and-call/database/certifications/model";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { toast } from "@roll-and-call/ui";
import { isNull, isUndefined, xor } from "es-toolkit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { EBOOK_REJECT_REASONS, REJECT_REASONS } from "@/entities/cert";
import { OTHER_REASON, useActionSubmit } from "@/shared/lib";
import type { CertDecisionResult, CertFormat, ShotKey } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

import { approveCert } from "../api/approve-cert";
import { approveCertGroup } from "../api/approve-cert-group";
import { rejectCert } from "../api/reject-cert";
import { rejectCertGroup } from "../api/reject-cert-group";
import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { decisionToastText } from "../model/decision-toast-text";
import type { GroupBook } from "../model/group-book";
import { groupDoneMessage } from "../model/group-done-message";
import { groupApproveIds, groupRejectIds, pendingGroupBooks } from "../model/group-selection";
import { isReviewShotKey } from "../model/is-review-shot-key";
import { rejectMessage } from "../model/reject-message";
import { reviewShots } from "../model/review-shots";
import { shotLabels } from "../model/shot-labels";
import type { ReviewShotKey } from "../model/shots";

interface UseCertDecisionOptions {
  applicationId: string;
  applicantNickname: string;
  rulebookId: string;
  rulebookLabel: string;
  format: CertFormat;
  groupBooks: GroupBook[];
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
  groupBooks,
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
  const groupApproval = useActionSubmit(approveCertGroup);
  const groupRejection = useActionSubmit(rejectCertGroup);
  const [rejectedBookIds, setRejectedBookIds] = useState<string[]>([]);
  const approvedBookIds = useRef<string[]>([]);
  const [checkedShots, setCheckedShots] = useState<ReviewShotKey[]>([]);
  const [flaggedShots, setFlaggedShots] = useState<ShotKey[]>([]);
  const [reason, setReason] = useState("");
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");

  const photoParam = searchParams.get("photo");
  const viewedShot = isReviewShotKey(photoParam) ? photoParam : null;
  const reviewable = state === CERT_REVIEW_STATE.open;
  const ebook = format === "ebook";
  const grouped = groupBooks.length > 0;
  const groupMode = reviewable && grouped;
  const rejecting = !groupMode && searchParams.get("mode") === "reject" && reviewable;
  const approveBookIds = groupMode
    ? groupApproveIds({ books: groupBooks, rejectedIds: rejectedBookIds })
    : [];
  const rejectBookIds = groupMode
    ? groupRejectIds({ books: groupBooks, rejectedIds: rejectedBookIds })
    : [];
  const showRejectPanel = rejecting || rejectBookIds.length > 0;
  const shots = reviewShots({ ebook, grouped, photoUrls });
  const approving = approval.pending || groupApproval.pending;
  const rejectingPending = rejection.pending || groupRejection.pending;
  const pending = approving || rejectingPending;
  const checkableShots: ReviewShotKey[] = reviewable
    ? shots.filter((shot) => photoUrls[shot.key]).map((shot) => shot.key)
    : [];
  const allChecked = checkableShots.every((key) => checkedShots.includes(key));
  const other = reason === OTHER_REASON;
  const reasonReady = Boolean(reason && userReason.trim());
  const groupPhotosReady = approveBookIds.length === 0 || allChecked;
  const groupReasonReady = rejectBookIds.length === 0 || reasonReady;
  const canSubmitGroup =
    !pending &&
    approveBookIds.length + rejectBookIds.length > 0 &&
    groupPhotosReady &&
    groupReasonReady;
  const canApprove = groupMode ? canSubmitGroup : reviewable && allChecked && !pending;
  const canReject = reasonReady && !pending;
  const canStartReject = reviewable && !pending;
  const flaggedLabels = shotLabels(flaggedShots);
  const afterHref = nextHref ?? queueHref;
  const label = `${applicantNickname} · ${rulebookLabel}`;
  const bookLabelOf = (ids: string[]) =>
    groupBooks.find((book) => book.applicationId === ids[0])?.label ?? rulebookLabel;
  const rejectOtherCount = Math.max(rejectBookIds.length - 1, 0);
  const previewPayload = reason
    ? {
        kind: NOTIFICATION_KIND.certRejected,
        params: {
          rulebookId,
          rulebookName: groupMode ? bookLabelOf(rejectBookIds) : rulebookLabel,
          otherCount: groupMode ? rejectOtherCount : undefined,
          rejectionSummary: rejectionSummary({
            rejectTag: other ? null : reason,
            flaggedShots,
            rejectReason: userReason,
          }),
        },
      }
    : null;
  const approvePreviewPayload =
    groupMode && approveBookIds.length > 0
      ? {
          kind: NOTIFICATION_KIND.certApproved,
          params: {
            rulebookId,
            rulebookName: bookLabelOf(approveBookIds),
            otherCount: approveBookIds.length - 1,
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

  const fail = (failure: Extract<CertDecisionResult, { ok: false }>) => {
    const text = decisionToastText({ failure, viewerId });
    if (!isNull(text)) toast.info(text);
    router.refresh();
  };

  const finish = (result: CertDecisionResult | undefined, message: string) => {
    if (isUndefined(result)) return;
    if (!result.ok) {
      fail(result);
      return;
    }
    toast.success(message);
    router.push(toServerPath(afterHref));
  };

  // 승인과 반려를 이어서 보낸다. 승인이 끝난 책은 기억해 두어, 반려만 실패해 다시 시도할 때 건너뛴다.
  const submitGroup = async () => {
    const toApprove = approveBookIds.filter((id) => !approvedBookIds.current.includes(id));
    if (toApprove.length > 0) {
      const result = await groupApproval.submit(toApprove);
      if (isUndefined(result)) return;
      if (!result.ok) {
        fail(result);
        return;
      }
      approvedBookIds.current = [...approvedBookIds.current, ...toApprove];
    }
    if (rejectBookIds.length > 0) {
      const result = await groupRejection.submit(rejectBookIds, {
        reasonTag: other ? null : reason,
        userReason,
        staffMemo,
      });
      if (isUndefined(result)) return;
      if (!result.ok) {
        fail(result);
        return;
      }
    }
    toast.success(
      groupDoneMessage({
        approveCount: approveBookIds.length,
        rejectCount: rejectBookIds.length,
        nickname: applicantNickname,
      }),
    );
    router.push(toServerPath(afterHref));
  };

  const approve = async () => {
    if (groupMode) {
      await submitGroup();
      return;
    }
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

  const setBookRejected = ({
    bookApplicationId,
    rejected,
  }: {
    bookApplicationId: string;
    rejected: boolean;
  }) =>
    setRejectedBookIds((current) => {
      const others = current.filter((id) => id !== bookApplicationId);
      return rejected ? [...others, bookApplicationId] : others;
    });

  const setAllBooksRejected = (rejected: boolean) =>
    setRejectedBookIds(
      rejected ? pendingGroupBooks(groupBooks).map((book) => book.applicationId) : [],
    );

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
    grouped,
    shots,
    reviewable,
    rejecting,
    viewedShot,
    pending,
    approving,
    rejectingPending,
    approvalNetworkError: approval.networkError || groupApproval.networkError,
    rejectionNetworkError: rejection.networkError || groupRejection.networkError,
    groupMode,
    rejectedBookIds,
    approveBookCount: approveBookIds.length,
    rejectBookCount: rejectBookIds.length,
    showRejectPanel,
    reasonReady,
    canStartReject,
    setBookRejected,
    setAllBooksRejected,
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
    approvePreviewPayload,
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
