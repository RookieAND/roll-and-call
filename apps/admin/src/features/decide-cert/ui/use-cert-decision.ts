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
import { approveCertGroup } from "../api/approve-cert-group";
import { rejectCert } from "../api/reject-cert";
import { rejectCertGroup } from "../api/reject-cert-group";
import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { decisionToastText } from "../model/decision-toast-text";
import type { GroupBook } from "../model/group-book";
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
  const [uncheckedBookIds, setUncheckedBookIds] = useState<string[]>([]);
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
  const grouped = groupBooks.length > 0;
  const groupMode = reviewable && grouped;
  const approveBookIds = groupMode
    ? groupApproveIds({ books: groupBooks, uncheckedIds: uncheckedBookIds })
    : [];
  const rejectBookIds = groupMode
    ? groupRejectIds({ books: groupBooks, uncheckedIds: uncheckedBookIds })
    : [];
  const shots = reviewShots({ ebook, grouped, photoUrls });
  const approving = approval.pending || groupApproval.pending;
  const rejectingPending = rejection.pending || groupRejection.pending;
  const pending = approving || rejectingPending;
  const checkableShots: ReviewShotKey[] = reviewable
    ? shots.filter((shot) => photoUrls[shot.key]).map((shot) => shot.key)
    : [];
  const allChecked = checkableShots.every((key) => checkedShots.includes(key));
  const canApprove =
    reviewable && allChecked && !pending && (!groupMode || approveBookIds.length > 0);
  const other = reason === OTHER_REASON;
  const canReject =
    Boolean(reason && userReason.trim()) && !pending && (!groupMode || rejectBookIds.length > 0);
  const canStartReject = reviewable && !pending && (!groupMode || rejectBookIds.length > 0);
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

  // 묶음의 일부만 처리했으면 남은 책을 이어서 처리하도록 그 책의 심사 화면으로 간다.
  const finishGroup = ({
    result,
    decidedIds,
    message,
  }: {
    result: CertDecisionResult | undefined;
    decidedIds: string[];
    message: string;
  }) => {
    if (isUndefined(result) || !result.ok) {
      finish(result, message);
      return;
    }
    toast.success(message);
    const remaining = pendingGroupBooks(groupBooks).find(
      (book) => !decidedIds.includes(book.applicationId),
    );
    if (!remaining) {
      router.push(toServerPath(afterHref));
      return;
    }
    if (remaining.applicationId === applicationId) router.refresh();
    else router.push(toServerPath(remaining.href));
  };

  const approve = async () => {
    if (groupMode) {
      finishGroup({
        result: await groupApproval.submit(approveBookIds),
        decidedIds: approveBookIds,
        message: `${approveBookIds.length}권을 승인했습니다 · ${applicantNickname}`,
      });
      return;
    }
    finish(await approval.submit(applicationId), `승인했습니다 · ${label}`);
  };

  const reject = async () => {
    if (groupMode) {
      finishGroup({
        result: await groupRejection.submit(rejectBookIds, {
          reasonTag: other ? null : reason,
          userReason,
          staffMemo,
        }),
        decidedIds: rejectBookIds,
        message: `${rejectBookIds.length}권을 반려했습니다 · ${applicantNickname}`,
      });
      return;
    }
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

  const toggleBook = (bookApplicationId: string) =>
    setUncheckedBookIds((current) => xor(current, [bookApplicationId]));

  const toggleAllBooks = () =>
    setUncheckedBookIds(
      approveBookIds.length === pendingGroupBooks(groupBooks).length
        ? pendingGroupBooks(groupBooks).map((book) => book.applicationId)
        : [],
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
    uncheckedBookIds,
    approveBookCount: approveBookIds.length,
    rejectBookCount: rejectBookIds.length,
    allBooksChecked: groupMode && rejectBookIds.length === 0,
    canStartReject,
    toggleBook,
    toggleAllBooks,
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
