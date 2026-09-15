"use client";

import { Button, cn, Container, Text } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FieldErrors } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";
import { AppBar, ConfirmDialog } from "@/shared/ui";

import { scrollToField } from "../lib/scroll-to-field";
import type { GameFormLayoutProps } from "../model/game-form-layout";
import { GameBasicsFields } from "./game-basics-fields";
import { GameMediaFields } from "./game-media-fields";
import { GameScheduleFields } from "./game-schedule-fields";

export function GameFormPage({ form, pending, submitLabel, onValid, edit }: GameFormLayoutProps) {
  const router = useRouter();
  const [confirmingLeave, setConfirmingLeave] = useState(false);
  const rootError = form.formState.errors.root?.message;
  const leaveHref = edit ? `/games/${edit.gameId}` : "/games";

  const applicants = edit?.applicantCount ?? 0;
  const noticeTitle =
    applicants > 0 ? `이미 ${applicants}명이 신청했습니다.` : "아직 신청자가 없습니다.";
  const noticeBody =
    applicants > 0
      ? "바꾼 내용은 저장하면 바로 상세에 반영되고, 디스코드 공지도 함께 고쳐집니다."
      : "모든 항목을 바꿀 수 있고, 저장하면 디스코드 공지도 함께 고쳐집니다.";
  const modeLockedReason =
    applicants > 0
      ? "신청자가 있어 일정 방식은 바꿀 수 없습니다. 바꾸려면 참여자 관리에서 명단을 비워주세요."
      : null;
  const sessionNotice =
    applicants > 0 ? `바꾸면 참여자 ${applicants}명의 세션 일시도 함께 바뀝니다.` : null;

  function onInvalid(errors: FieldErrors<GameFormValues>) {
    const first = Object.keys(errors)[0];
    if (first) setTimeout(() => scrollToField(first), 0);
  }

  function requestLeave() {
    if (form.formState.isDirty) setConfirmingLeave(true);
    else router.push(leaveHref);
  }

  return (
    <form onSubmit={form.handleSubmit(onValid, onInvalid)} className="flex min-h-dvh flex-col">
      <AppBar title="구인 수정" onBack={requestLeave} />

      <Container size="md" className="flex-1">
        <div className="flex flex-col gap-5 py-6">
          {edit && (
            <div className="rounded-xl bg-gray-50 px-3.5 py-3">
              <Text typography="subtitle2" render={<p />}>
                {noticeTitle}
              </Text>
              <Text typography="body4" foreground="muted" render={<p />} className="mt-0.5">
                {noticeBody}
              </Text>
            </div>
          )}

          <fieldset
            disabled={pending}
            className={cn("m-0 flex flex-col gap-5 border-0 p-0", pending && "opacity-45")}
          >
            <GameBasicsFields form={form} minPlayers={Math.max(1, edit?.confirmedCount ?? 1)} />
            <GameMediaFields form={form} />
            <GameScheduleFields
              form={form}
              modeLockedReason={modeLockedReason}
              sessionNotice={sessionNotice}
            />
          </fieldset>
        </div>
      </Container>

      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-surface">
        <Container size="md" className="flex flex-col gap-3 py-3">
          {rootError && (
            <Text typography="body2" foreground="danger" render={<p />}>
              {rootError}
            </Text>
          )}
          <div className="flex gap-2 [&>*]:flex-1">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-[50px]"
              onClick={requestLeave}
            >
              취소
            </Button>
            <Button type="submit" loading={pending} size="lg" className="h-[50px]">
              {pending ? "저장 중…" : submitLabel}
            </Button>
          </div>
        </Container>
      </div>

      <ConfirmDialog
        open={confirmingLeave}
        onOpenChange={setConfirmingLeave}
        title="수정을 그만둘까요?"
        description="바꾼 내용은 저장되지 않습니다."
        cancelLabel="이어서 고치기"
        confirmLabel="그만두기"
        danger
        onConfirm={() => router.push(leaveHref)}
      />
    </form>
  );
}
