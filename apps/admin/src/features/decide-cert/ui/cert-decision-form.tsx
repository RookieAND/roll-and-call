"use client";

import { rejectionSummary } from "@roll-and-call/database/certifications/model";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Button, Grid, VStack, cn, toast } from "@roll-and-call/ui";
import { isNull, isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";

import { useActionSubmit } from "@/shared/lib";
import type { CertDecisionResult, CertFormat, ShotKey } from "@/shared/server";
import {
  ActionNetworkError,
  KeyHint,
  NextItemButton,
  NotificationPreview,
  useServerPath,
} from "@/shared/ui";

import { approveCert } from "../api/approve-cert";
import { rejectCert } from "../api/reject-cert";
import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { decisionToastText } from "../model/decision-toast-text";
import { rejectMessage } from "../model/reject-message";
import { EBOOK_REJECT_REASONS, REJECT_REASONS } from "../model/reject-reasons";
import { EBOOK_SHOTS, SHOTS } from "../model/shots";
import { DecisionFooter } from "./decision-footer";
import { FlaggedStatus } from "./flagged-status";
import { RejectPanel } from "./reject-panel";
import { ShotCard } from "./shot-card";
import { ShotSectionHeader } from "./shot-section-header";
import { ShotViewer } from "./shot-viewer";
import { SkipStatus } from "./skip-status";
import { useDecisionKeys } from "./use-decision-keys";

const toggle = <Key extends string>(list: Key[], item: Key) =>
  list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];

interface CertDecisionFormProps {
  applicationId: string;
  applicantNickname: string;
  rulebookId: string;
  rulebookLabel: string;
  format: CertFormat;
  photoUrls: Partial<Record<string, string>>;
  previousUrls: Partial<Record<string, string>>;
  // 재신청이면 사진마다 「새로 올림」·「지난번과 같음」
  freshLabels: Partial<Record<string, string>>;
  state: CertReviewState;
  proofDeleted: boolean;
  nextHref?: string;
  queueHref: string;
  viewerId: string;
  children: ReactNode;
}

export function CertDecisionForm({
  applicationId,
  applicantNickname,
  rulebookId,
  rulebookLabel,
  format,
  photoUrls,
  previousUrls,
  freshLabels,
  state,
  proofDeleted,
  nextHref,
  queueHref,
  viewerId,
  children,
}: CertDecisionFormProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const approveRef = useRef<HTMLButtonElement>(null);
  const approval = useActionSubmit(approveCert);
  const rejection = useActionSubmit(rejectCert);
  const [checkedShots, setCheckedShots] = useState<string[]>([]);
  const [flaggedShots, setFlaggedShots] = useState<ShotKey[]>([]);
  const [reason, setReason] = useState("");
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");

  const reviewable = state === CERT_REVIEW_STATE.open;
  const rejecting = searchParams.get("mode") === "reject" && reviewable;
  const viewedShot = searchParams.get("photo");
  const ebook = format === "ebook";
  const shots = ebook ? EBOOK_SHOTS : SHOTS;
  const pending = approval.pending || rejection.pending;
  const checkableShots = reviewable
    ? shots.filter((shot) => photoUrls[shot.key]).map((shot) => shot.key as string)
    : [];
  const allChecked = checkableShots.every((key) => checkedShots.includes(key));
  const canApprove = reviewable && allChecked && !pending;
  const canReject = Boolean(reason && userReason.trim()) && !pending;
  const flaggedLabels = SHOTS.filter((shot) => flaggedShots.includes(shot.key as ShotKey)).map(
    (shot) => shot.label,
  );
  const afterHref = nextHref ?? queueHref;
  const label = `${applicantNickname} · ${rulebookLabel}`;
  const previewPayload = reason
    ? {
        kind: NOTIFICATION_KIND.certRejected,
        params: {
          rulebookId,
          rulebookName: rulebookLabel,
          rejectionSummary: rejectionSummary({
            rejectTag: reason,
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
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
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
        reasonTag: reason,
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
    const nextFlagged = toggle(flaggedShots, shot);
    const nextLabels = SHOTS.filter((candidate) =>
      nextFlagged.includes(candidate.key as ShotKey),
    ).map((candidate) => candidate.label);
    setFlaggedShots(nextFlagged);
    if (reason) {
      setUserReason(
        rejectMessage({ text: userReason, previousShots: flaggedLabels, shots: nextLabels }),
      );
    }
  };

  const toggleCheck = (key: string) => {
    if (!checkableShots.includes(key)) return;
    setCheckedShots(toggle(checkedShots, key));
  };

  // 확대 창에서 체크하면 다음 사진으로, 마지막 체크 뒤에는 창을 닫고 [승인]에 포커스를 둔다(finalFocus).
  const checkInViewer = (key: string) => {
    const nextChecked = toggle(checkedShots, key);
    setCheckedShots(nextChecked);
    if (!nextChecked.includes(key)) return;
    if (checkableShots.every((shot) => nextChecked.includes(shot))) {
      setParam("photo", null);
      return;
    }
    const index = shots.findIndex((shot) => shot.key === key);
    setParam("photo", shots[(index + 1) % shots.length]!.key);
  };

  useDecisionKeys({
    enabled: reviewable && !viewedShot && !pending,
    rejecting,
    canApprove,
    onReject: () => setParam("mode", "reject"),
    onCancelReject: () => setParam("mode", null),
    onApprove: () => void approve(),
    onCheck: (index) => {
      const shot = shots[index];
      if (shot) toggleCheck(shot.key);
    },
  });

  const networkError = approval.networkError || rejection.networkError;
  const footerNotice = networkError ? <ActionNetworkError /> : null;

  const renderFooter = () => {
    if (state === CERT_REVIEW_STATE.withdrawn) {
      return (
        <DecisionFooter>
          <NextItemButton href={nextHref} />
        </DecisionFooter>
      );
    }
    if (rejecting) {
      return (
        <DecisionFooter
          notice={footerNotice}
          status={<FlaggedStatus reason={reason} flaggedLabels={flaggedLabels} />}
        >
          <Button variant="ghost" colorPalette="gray" onClick={() => setParam("mode", null)}>
            취소
            <KeyHint keyLabel="Esc" />
          </Button>
          <Button
            colorPalette="danger"
            className="min-w-[104px]"
            disabled={!canReject}
            loading={rejection.pending}
            onClick={() => void reject()}
          >
            {rejection.networkError ? <RotateCcw size={16} aria-hidden /> : null}
            {rejection.networkError ? "다시 시도" : "반려 확정"}
          </Button>
        </DecisionFooter>
      );
    }
    return (
      <DecisionFooter
        notice={footerNotice}
        status={
          <SkipStatus
            note={
              reviewable && !allChecked ? "모든 확인 항목을 체크해야 승인할 수 있습니다" : undefined
            }
            onSkip={() => router.push(toServerPath(afterHref))}
          />
        }
      >
        <Button
          variant="outline"
          colorPalette="danger"
          disabled={!reviewable || pending}
          onClick={() => setParam("mode", "reject")}
        >
          반려
          <KeyHint keyLabel="R" />
        </Button>
        <Button
          ref={approveRef}
          className="min-w-[112px]"
          disabled={!canApprove}
          loading={approval.pending}
          onClick={() => void approve()}
        >
          {approval.networkError ? <RotateCcw size={16} aria-hidden /> : null}
          {approval.networkError ? "다시 시도" : "승인"}
          {approval.networkError ? null : <KeyHint keyLabel="⏎" />}
        </Button>
        {state === CERT_REVIEW_STATE.processed ? <NextItemButton href={nextHref} /> : null}
      </DecisionFooter>
    );
  };

  return (
    <>
      <VStack gap="175" className="w-full flex-1 p-200">
        {children}
        {state === CERT_REVIEW_STATE.withdrawn ? null : (
          <VStack
            gap="125"
            render={<section aria-labelledby="shot-section-title" />}
            aria-disabled={!reviewable}
            className={cn(state === CERT_REVIEW_STATE.waiting && "opacity-50")}
          >
            <ShotSectionHeader
              title={ebook ? "구매 기록 확인" : "사진 확인"}
              checkedCount={checkedShots.length}
              total={checkableShots.length}
              deleted={proofDeleted}
            />
            <Grid className={cn("gap-150", shots.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
              {shots.map((shot, index) => {
                const checked = checkedShots.includes(shot.key);
                const flagged = rejecting && flaggedShots.includes(shot.key as ShotKey);
                return (
                  <ShotCard
                    key={shot.key}
                    index={index}
                    label={shot.label}
                    note={shot.note}
                    question={shot.question}
                    url={photoUrls[shot.key]}
                    fresh={freshLabels[shot.key]}
                    deleted={proofDeleted}
                    checked={checked}
                    disabled={!reviewable || pending}
                    flagged={flagged}
                    flaggable={rejecting && !ebook && (!checked || flagged)}
                    onCheckedChange={() => toggleCheck(shot.key)}
                    onFlagToggle={() => toggleFlag(shot.key as ShotKey)}
                    onZoom={() => setParam("photo", shot.key)}
                  />
                );
              })}
            </Grid>
          </VStack>
        )}
        {rejecting ? (
          <VStack gap="150">
            <RejectPanel
              ebook={ebook}
              reason={reason}
              userReason={userReason}
              staffMemo={staffMemo}
              onReasonChange={chooseReason}
              onUserReasonChange={setUserReason}
              onStaffMemoChange={setStaffMemo}
            />
            <NotificationPreview
              payload={previewPayload}
              recipients="신청자의 알림 탭으로 알립니다."
            />
          </VStack>
        ) : null}
      </VStack>
      <ShotViewer
        shots={shots}
        shot={viewedShot}
        photoUrls={photoUrls}
        previousUrls={previousUrls}
        checkedShots={checkedShots}
        checkableShots={checkableShots}
        finalFocus={approveRef}
        onShotChange={(shot) => setParam("photo", shot)}
        onCheck={checkInViewer}
      />
      {renderFooter()}
    </>
  );
}
