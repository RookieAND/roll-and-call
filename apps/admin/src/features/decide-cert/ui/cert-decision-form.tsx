"use client";

import { Button, Grid, VStack, cn, toast } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, type ReactNode } from "react";

import type { CertDecisionResult, CertFormat, ShotKey } from "@/shared/server";
import { KeyHint } from "@/shared/ui";

import { approveCert } from "../api/approve-cert";
import { rejectCert } from "../api/reject-cert";
import { OTHER_REASON } from "../model/reject-reasons";
import { EBOOK_SHOTS, SHOTS, type ReviewShot } from "../model/shots";
import { DecisionFooter } from "./decision-footer";
import { FlaggedStatus } from "./flagged-status";
import { RejectPanel } from "./reject-panel";
import { ShotCard } from "./shot-card";
import { ShotSectionHeader } from "./shot-section-header";
import { ShotViewer } from "./shot-viewer";
import { SkipStatus } from "./skip-status";

const SHOT_KEYS: ShotKey[] = ["front", "back", "side"];

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

interface CertDecisionFormProps {
  applicationId: string;
  applicantLabel: string;
  format: CertFormat;
  // 실물은 앞면·뒷면·책등, 전자책은 구매 내역(order)·영수증(receipt) 주소.
  photoUrls: Partial<Record<ReviewShot["key"], string | null>>;
  replacedShots: ShotKey[];
  nextId: string | null;
  compact: boolean;
  disabled: boolean;
  // 신청자가 거둔 신청은 사진이 지워져 사진 칸을 두지 않는다.
  hideShots?: boolean;
  children: ReactNode;
  // 사진 아래에 두는 본문 퀴즈 결과.
  quiz: ReactNode;
}

// 사진(전자책은 구매 기록) 확인 항목을 모두 체크해야 승인할 수 있다. 반려는 언제든. 반려 중인지와 확대한 사진은 주소(mode·photo)가 기억한다.
export function CertDecisionForm({
  applicationId,
  applicantLabel,
  format,
  photoUrls,
  replacedShots,
  nextId,
  compact,
  disabled,
  hideShots = false,
  children,
  quiz,
}: CertDecisionFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [checkedShots, setCheckedShots] = useState<string[]>([]);
  const [flaggedShots, setFlaggedShots] = useState<ShotKey[]>([]);
  const [reasonChoice, setReasonChoice] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");

  const rejecting = searchParams.get("mode") === "reject" && !disabled;
  const viewedShot = searchParams.get("photo");
  const ebook = format === "ebook";
  const shots = ebook ? EBOOK_SHOTS : SHOTS;
  // 전자책 캡처는 문제 사진으로 지정하지 않는다. 사용자 앱이 사진 칸 이름으로 안내한다.
  const flaggable = !ebook;
  const allChecked = checkedShots.length === shots.length;
  const approveDisabled = disabled || !allChecked;
  const reasonTag = reasonChoice === OTHER_REASON ? otherReason.trim() : reasonChoice;
  const canReject = Boolean(reasonTag && userReason.trim()) && !pending;
  const nextHref = nextId ? `/cert/${nextId}` : "/cert";

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const finish = (result: CertDecisionResult, message: string) => {
    if (!result.ok) {
      toast.info(
        "blocked" in result
          ? result.blocked
          : result.conflict.status === "withdrawn"
            ? "신청자가 신청을 거뒀습니다"
            : "다른 운영진이 먼저 처리했습니다",
      );
      router.refresh();
      return;
    }
    toast.success(message);
    router.push(nextHref);
  };

  const approve = () =>
    startTransition(async () => {
      finish(await approveCert(applicationId), `승인했습니다 · ${applicantLabel}`);
    });

  const reject = () =>
    startTransition(async () => {
      finish(
        await rejectCert(applicationId, { reasonTag, userReason, staffMemo, flaggedShots }),
        `반려했습니다 · ${applicantLabel}`,
      );
    });

  const toggle = <Key extends string>(list: Key[], shot: Key) =>
    list.includes(shot) ? list.filter((item) => item !== shot) : [...list, shot];
  const flagShot = (key: ReviewShot["key"]) => {
    const shot = SHOT_KEYS.find((candidate) => candidate === key);
    if (flaggable && shot) setFlaggedShots(toggle(flaggedShots, shot));
  };

  useEffect(() => {
    if (disabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      if (viewedShot || pending) return;
      if (event.key.toLowerCase() === "r" && !rejecting) setParam("mode", "reject");
      if (
        event.key === "Enter" &&
        !rejecting &&
        !approveDisabled &&
        event.target === document.body
      ) {
        approve();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <>
      <VStack gap="175" className="mx-auto w-full max-w-content flex-1 p-200">
        {children}
        {hideShots ? null : (
          <VStack
            gap="125"
            render={<section aria-labelledby="shot-section-title" />}
            aria-disabled={disabled}
            className={cn(disabled && "pointer-events-none opacity-50")}
          >
            <ShotSectionHeader
              title={ebook ? "구매 기록 확인" : "사진 확인"}
              checkedCount={checkedShots.length}
              total={shots.length}
              rejecting={rejecting && flaggable}
            />
            <Grid className={cn("gap-150", shots.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
              {shots.map((shot) => (
                <ShotCard
                  key={shot.key}
                  label={shot.label}
                  note={shot.note}
                  question={shot.question}
                  url={photoUrls[shot.key] ?? undefined}
                  checked={checkedShots.includes(shot.key)}
                  flagged={rejecting && flaggedShots.some((flagged) => flagged === shot.key)}
                  replaced={replacedShots.some((replaced) => replaced === shot.key)}
                  tall={shots.length === 2}
                  compact={compact || rejecting}
                  disabled={disabled}
                  onCheckedChange={() => setCheckedShots(toggle(checkedShots, shot.key))}
                  onPhotoClick={() =>
                    rejecting && flaggable ? flagShot(shot.key) : setParam("photo", shot.key)
                  }
                  onZoom={() => setParam("photo", shot.key)}
                />
              ))}
            </Grid>
          </VStack>
        )}
        {quiz}
        {rejecting ? (
          <RejectPanel
            ebook={ebook}
            reasonChoice={reasonChoice}
            otherReason={otherReason}
            userReason={userReason}
            staffMemo={staffMemo}
            onReasonChoiceChange={setReasonChoice}
            onOtherReasonChange={setOtherReason}
            onUserReasonChange={setUserReason}
            onStaffMemoChange={setStaffMemo}
          />
        ) : null}
      </VStack>
      <ShotViewer
        shots={shots}
        shot={viewedShot}
        photoUrls={photoUrls}
        onShotChange={(shot) => setParam("photo", shot)}
      />
      {rejecting ? (
        <DecisionFooter
          status={<FlaggedStatus reasonTag={reasonTag} flaggedShots={flaggedShots} />}
        >
          <Button variant="ghost" colorPalette="gray" onClick={() => setParam("mode", null)}>
            취소
          </Button>
          <Button
            colorPalette="danger"
            className="min-w-[104px]"
            disabled={!canReject}
            loading={pending}
            onClick={reject}
          >
            반려 확정
          </Button>
        </DecisionFooter>
      ) : (
        <DecisionFooter
          status={
            <SkipStatus
              note={
                disabled || allChecked ? undefined : "모든 확인 항목을 체크해야 승인할 수 있습니다"
              }
              onSkip={() => router.push(nextHref)}
            />
          }
        >
          <Button
            variant="outline"
            colorPalette="danger"
            disabled={disabled || pending}
            onClick={() => setParam("mode", "reject")}
          >
            반려
            <KeyHint keyLabel="R" />
          </Button>
          <Button
            className="min-w-[112px]"
            disabled={approveDisabled}
            loading={pending}
            onClick={approve}
          >
            승인
            <KeyHint keyLabel="⏎" />
          </Button>
        </DecisionFooter>
      )}
    </>
  );
}
