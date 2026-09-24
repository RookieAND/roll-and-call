"use client";

import { Button, Grid, VStack, cn, toast } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, type ReactNode } from "react";

import type { CertDecisionResult, ShotKey } from "@/shared/server";
import { KeyHint } from "@/shared/ui";

import { approveCert } from "../api/approve-cert";
import { rejectCert } from "../api/reject-cert";
import { OTHER_REASON } from "../model/reject-reasons";
import { SHOTS } from "../model/shots";
import { DecisionFooter } from "./decision-footer";
import { FlaggedStatus } from "./flagged-status";
import { RejectPanel } from "./reject-panel";
import { ShotCard } from "./shot-card";
import { ShotSectionHeader } from "./shot-section-header";
import { ShotViewer } from "./shot-viewer";
import { SkipStatus } from "./skip-status";

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

interface CertDecisionFormProps {
  applicationId: string;
  applicantLabel: string;
  photoUrls: Partial<Record<ShotKey, string>>;
  replacedShots: ShotKey[];
  nextId: string | null;
  compact: boolean;
  disabled: boolean;
  children: ReactNode;
}

// 사진 3장 확인 → 승인 또는 반려. 반려 중인지와 확대한 사진은 주소(mode·photo)가 기억한다.
export function CertDecisionForm({
  applicationId,
  applicantLabel,
  photoUrls,
  replacedShots,
  nextId,
  compact,
  disabled,
  children,
}: CertDecisionFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [checkedShots, setCheckedShots] = useState<ShotKey[]>([]);
  const [flaggedShots, setFlaggedShots] = useState<ShotKey[]>([]);
  const [reasonChoice, setReasonChoice] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");

  const rejecting = searchParams.get("mode") === "reject" && !disabled;
  const viewedShot = searchParams.get("photo") as ShotKey | null;
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
      toast.info("다른 운영진이 먼저 처리했습니다");
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

  const toggle = (list: ShotKey[], shot: ShotKey) =>
    list.includes(shot) ? list.filter((item) => item !== shot) : [...list, shot];

  useEffect(() => {
    if (disabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      if (viewedShot || pending) return;
      if (event.key.toLowerCase() === "r" && !rejecting) setParam("mode", "reject");
      if (event.key === "Enter" && !rejecting && event.target === document.body) approve();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <>
      <VStack gap="175" className="mx-auto w-full max-w-content flex-1 p-200">
        {children}
        <VStack
          gap="125"
          render={<section aria-labelledby="shot-section-title" />}
          aria-disabled={disabled}
          className={cn(disabled && "pointer-events-none opacity-50")}
        >
          <ShotSectionHeader
            checkedCount={checkedShots.length}
            total={SHOTS.length}
            rejecting={rejecting}
          />
          <Grid className="grid-cols-3 gap-150">
            {SHOTS.map((shot) => (
              <ShotCard
                key={shot.key}
                label={shot.label}
                note={shot.note}
                question={shot.question}
                url={photoUrls[shot.key]}
                checked={checkedShots.includes(shot.key)}
                flagged={rejecting && flaggedShots.includes(shot.key)}
                replaced={replacedShots.includes(shot.key)}
                compact={compact || rejecting}
                disabled={disabled}
                onCheckedChange={() => setCheckedShots(toggle(checkedShots, shot.key))}
                onPhotoClick={() =>
                  rejecting
                    ? setFlaggedShots(toggle(flaggedShots, shot.key))
                    : setParam("photo", shot.key)
                }
                onZoom={() => setParam("photo", shot.key)}
              />
            ))}
          </Grid>
        </VStack>
        {rejecting ? (
          <RejectPanel
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
        <DecisionFooter status={<SkipStatus onSkip={() => router.push(nextHref)} />}>
          <Button
            variant="outline"
            colorPalette="danger"
            disabled={disabled || pending}
            onClick={() => setParam("mode", "reject")}
          >
            반려
            <KeyHint keyLabel="R" />
          </Button>
          <Button className="min-w-[112px]" disabled={disabled} loading={pending} onClick={approve}>
            승인
            <KeyHint keyLabel="⏎" />
          </Button>
        </DecisionFooter>
      )}
    </>
  );
}
