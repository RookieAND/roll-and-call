"use client";

import { Button, Callout, FloatingBar, HStack, Text, VStack } from "@roll-and-call/ui";
import { uniq } from "es-toolkit";
import { useState } from "react";

import { rankWindows, windowMembers } from "@/entities/availability";
import { slotIso, toKst, type DayColumn } from "@/shared/lib";
import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { confirmSession } from "../api/confirm-session";
import { toSessionStart } from "../model/session-start";
import { sessionWindowLabel } from "../model/session-window-label";
import { NoCandidatesNotice } from "./no-candidates-notice";
import { SessionCandidateList } from "./session-candidate-list";
import { SessionTimeFields } from "./session-time-fields";
import { SessionWindowSummary } from "./session-window-summary";
import { UnavailableWarning } from "./unavailable-warning";

// 후보를 더 늘리면 고르는 일이 다시 읽는 일이 된다. 나머지는 직접 입력 칸으로 간다.
const CANDIDATE_LIMIT = 3;
const DEFAULT_HOUR = 19;

interface ConfirmSessionFormProps {
  gameId: string;
  days: DayColumn[];
  rangeStart: string;
  names: Record<string, string[]>;
  playMinutes: number;
  playLabel: string;
  slotCount: number;
  confirmedCount: number;
  maxPlayers: number;
  currentIso?: string | null;
}

export function ConfirmSessionForm({
  gameId,
  days,
  rangeStart,
  names,
  playMinutes,
  playLabel,
  slotCount,
  confirmedCount,
  maxPlayers,
  currentIso = null,
}: ConfirmSessionFormProps) {
  const candidates = rankWindows({ names, slotCount, limit: CANDIDATE_LIMIT });
  const respondents = uniq(Object.values(names).flat());
  const changing = currentIso !== null;

  const [start, setStart] = useState(() => {
    const seed = currentIso ?? candidates[0]?.iso;
    if (seed) return toSessionStart(seed);
    return { date: rangeStart, hour: DEFAULT_HOUR, minute: 0 };
  });
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { pending, run } = useAction();

  const startIso = slotIso(start.date, start.hour, start.minute);
  const members = windowMembers({ names, startIso, slotCount });
  const absentNames = respondents.filter((name) => !members.includes(name));
  const startLabel = toKst(startIso).format("M/D (dd) HH:mm");

  function submit() {
    setError(null);
    run(() => confirmSession(gameId, startIso), {
      onSuccess: () => {
        setConfirming(false);
        toast.success(changing ? "확정 시간을 바꿨습니다" : "세션이 확정되었습니다");
      },
      onError: (result) => {
        setError(result.error);
        setConfirming(false);
      },
    });
  }

  const windowLabel = sessionWindowLabel(startIso, playMinutes);
  const pickedCandidate = candidates.find((candidate) => candidate.iso === startIso)?.iso ?? null;

  return (
    <VStack gap="250">
      <VStack gap="125" render={<section />}>
        <Text typography="subtitle2" render={<h2 />}>
          세션 시간
        </Text>
        <SessionTimeFields days={days} start={start} onChange={setStart} />
        <Text typography="body4" foreground="hint" render={<p />}>
          시작 시각부터 {playLabel}이 끊기지 않고 비는 시간만 셉니다.
        </Text>
        <SessionWindowSummary
          windowLabel={windowLabel}
          memberCount={members.length}
          everyone={absentNames.length === 0}
        />
        {absentNames.length > 0 && <UnavailableWarning names={absentNames} />}
      </VStack>

      <VStack gap="125" render={<section />}>
        <HStack align="baseline" gap="075">
          <Text typography="subtitle2" render={<h2 />}>
            추천 후보
          </Text>
          <Text numeric typography="subtitle2" foreground="muted" render={<span />}>
            {candidates.length}개
          </Text>
          <span className="flex-1" />
          <Text typography="body4" foreground="hint" render={<span />}>
            겹치는 인원 순
          </Text>
        </HStack>
        {candidates.length === 0 ? (
          <NoCandidatesNotice playLabel={playLabel} respondentCount={respondents.length} />
        ) : (
          <SessionCandidateList
            candidates={candidates}
            playMinutes={playMinutes}
            respondents={respondents}
            value={pickedCandidate}
            onPick={(iso) => setStart(toSessionStart(iso))}
          />
        )}
      </VStack>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          {error && (
            <Callout.Root colorPalette="danger" size="sm" className="mb-125">
              <Callout.Icon />
              <Callout.Description>{error}</Callout.Description>
            </Callout.Root>
          )}
          <Button
            variant="solid"
            colorPalette="success"
            size="lg"
            className="w-full"
            onClick={() => setConfirming(true)}
          >
            {startLabel}
            {changing ? "으로 변경" : "으로 확정"}
          </Button>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={changing ? "확정 시간을 바꿀까요?" : "이 시간으로 확정할까요?"}
        description={
          <>
            확정하면 새 신청을 받지 않고, 명단도 고칠 수 없습니다.
            <br />
            {!changing && confirmedCount < maxPlayers && (
              <>
                정원 {maxPlayers}명 중 {confirmedCount}명으로 확정하면 모집이 닫혀요.
                <br />
              </>
            )}
            참여자 {confirmedCount}명에게 디스코드로 알립니다.
          </>
        }
        confirmLabel={changing ? "변경" : "확정"}
        confirmColorPalette="success"
        pending={pending}
        onConfirm={submit}
      >
        <Text numeric typography="subtitle1" foreground="success" render={<p />}>
          {windowLabel}
        </Text>
      </ConfirmDialog>
    </VStack>
  );
}
