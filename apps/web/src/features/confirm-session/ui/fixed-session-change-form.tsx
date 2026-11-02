"use client";

import { Button, Container, FloatingBar, Text, VStack } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { formatDateTime, toKst } from "@/shared/lib";
import { ConfirmDialog, PageShell, toast, useAction } from "@/shared/ui";

import { confirmSession } from "../api/confirm-session";
import { confirmDialogContent } from "../model/confirm-dialog-content";
import { fixedSessionDates } from "../model/fixed-session-dates";
import { sessionDialogLabel } from "../model/session-dialog-label";
import type { SessionStart } from "../model/session-start";
import { sessionStartIso } from "../model/session-start-iso";
import { ConfirmSessionDialogBody } from "./confirm-session-dialog-body";
import { FixedSessionTimeFields } from "./fixed-session-time-fields";

interface FixedSessionChangeFormProps {
  gameId: string;
  endDate: Date;
  confirmedAt: Date;
  confirmedCount: number;
  playMinutes: number;
  appBar: ReactNode;
}

export function FixedSessionChangeForm({
  gameId,
  endDate,
  confirmedAt,
  confirmedCount,
  playMinutes,
  appBar,
}: FixedSessionChangeFormProps) {
  const [now] = useState(() => new Date());
  const dates = fixedSessionDates({ endDate, now });
  const [start, setStart] = useState<SessionStart>(() => {
    const kst = toKst(confirmedAt);
    return { date: kst.format("YYYY-MM-DD"), minutes: kst.hour() * 60 + kst.minute() };
  });
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);
  const { pending, run } = useAction();

  const startIso = sessionStartIso(start);
  const nextAt = new Date(startIso);
  const afterDeadline = nextAt.getTime() > endDate.getTime() && nextAt.getTime() > now.getTime();
  const dialogContent = confirmDialogContent({
    previousLabel: sessionDialogLabel({ iso: confirmedAt.toISOString(), playMinutes }),
    nextLabel: sessionDialogLabel({ iso: startIso, playMinutes }),
    confirmedCount,
    maxPlayers: confirmedCount,
  });
  const failure = failed ? ["시간을 바꾸지 못했습니다.", "잠시 뒤 다시 시도해 주세요."] : null;
  const hintForeground = afterDeadline ? "hint" : "warning";

  function openConfirm() {
    setFailed(false);
    setConfirming(true);
  }

  function submit() {
    setFailed(false);
    run(() => confirmSession({ gameId, slotIso: startIso }), {
      onSuccess: () => {
        setConfirming(false);
        toast.success("세션 시간을 바꿨습니다");
      },
      onError: () => setFailed(true),
    });
  }

  const changeButton = (
    <Button
      variant="solid"
      colorPalette="success"
      size="lg"
      className="w-full"
      disabled={!afterDeadline}
      onClick={openConfirm}
    >
      세션 시간 바꾸기
    </Button>
  );

  return (
    <PageShell readable appBar={appBar} panel={changeButton}>
      <Container size="sm" className="desktop:px-0">
        <VStack gap="250" className="pt-200 pb-200 desktop:pt-0 desktop:pb-0">
          <VStack gap="125" render={<section />}>
            <Text typography="subtitle1" render={<h2 />}>
              새 세션 시간
            </Text>
            <FixedSessionTimeFields dates={dates} start={start} onChange={setStart} />
            <Text typography="body4" foreground={hintForeground} render={<p />}>
              모집 마감 뒤의 시각만 고를 수 있습니다.
              <br />
              마감은 {formatDateTime(endDate)}입니다.
            </Text>
          </VStack>

          <div className="desktop:hidden">
            <FloatingBar.Root elevated={false}>
              <FloatingBar.Content>{changeButton}</FloatingBar.Content>
              <FloatingBar.Spacer />
            </FloatingBar.Root>
          </div>

          <ConfirmDialog
            open={confirming}
            onOpenChange={setConfirming}
            title="세션 시간을 바꿀까요?"
            confirmLabel={failed ? "다시 시도" : "바꾸기"}
            confirmColorPalette="success"
            pending={pending}
            onConfirm={submit}
          >
            <ConfirmSessionDialogBody content={dialogContent} failure={failure} />
          </ConfirmDialog>
        </VStack>
      </Container>
    </PageShell>
  );
}
