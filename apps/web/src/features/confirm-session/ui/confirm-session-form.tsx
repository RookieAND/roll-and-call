"use client";

import { Button, Callout, FloatingBar, HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull, uniq } from "es-toolkit";
import { useState } from "react";

import { rankWindows, windowMembers } from "@/entities/availability";
import { coordinationWindowOf } from "@/entities/game";
import { buildDayColumns, buildTimeRows, SLOT_MINUTES, toKst } from "@/shared/lib";
import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { confirmSession } from "../api/confirm-session";
import type { ConfirmSessionGame } from "../model/confirm-session-game";
import { initialSessionStart } from "../model/initial-session-start";
import { toSessionStart } from "../model/session-start";
import { sessionStartIso } from "../model/session-start-iso";
import { sessionWindowLabel } from "../model/session-window-label";
import { ConfirmSessionDialogBody } from "./confirm-session-dialog-body";
import { NoCandidatesNotice } from "./no-candidates-notice";
import { SessionCandidateList } from "./session-candidate-list";
import { SessionTimeFields } from "./session-time-fields";
import { SessionWindowSummary } from "./session-window-summary";
import { UnavailableWarning } from "./unavailable-warning";

const CANDIDATE_LIMIT = 3;

interface ConfirmSessionFormProps {
  game: ConfirmSessionGame;
  names: Record<string, string[]>;
  playLabel: string;
}

export function ConfirmSessionForm({ game, names, playLabel }: ConfirmSessionFormProps) {
  const { id: gameId, playMinutes, confirmedAt } = game;
  const days = buildDayColumns({ rangeStart: game.rangeStart, rangeEnd: game.rangeEnd });
  const window = coordinationWindowOf(game);
  const slotCount = Math.ceil(playMinutes / SLOT_MINUTES);
  const candidates = rankWindows({ names, slotCount, limit: CANDIDATE_LIMIT });
  const respondents = uniq(Object.values(names).flat());
  const changing = !isNull(confirmedAt);

  const [start, setStart] = useState(() =>
    initialSessionStart({
      seedIso: confirmedAt?.toISOString() ?? candidates[0]?.iso ?? null,
      rangeStart: game.rangeStart,
      window,
      timeRows: buildTimeRows(window),
    }),
  );
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { pending, run } = useAction();

  const startIso = sessionStartIso(start);
  const members = windowMembers({ names, startIso, slotCount });
  const absentNames = respondents.filter((name) => !members.includes(name));
  const startLabel = toKst(startIso).format("M/D (dd) HH:mm");

  function submit() {
    setError(null);
    run(() => confirmSession({ gameId, slotIso: startIso }), {
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

  const windowLabel = sessionWindowLabel({ iso: startIso, playMinutes });
  const pickedCandidate = candidates.find((candidate) => candidate.iso === startIso)?.iso ?? null;

  return (
    <VStack gap="250">
      <VStack gap="125" render={<section />}>
        <Text typography="subtitle2" render={<h2 />}>
          세션 시간
        </Text>
        <SessionTimeFields days={days} window={window} start={start} onChange={setStart} />
        <Text typography="body4" foreground="hint" render={<p />}>
          시작 시각부터 {playLabel}이 끊기지 않고 비는 시간만 셉니다.
        </Text>
        <SessionWindowSummary
          windowLabel={windowLabel}
          memberCount={members.length}
          respondentCount={respondents.length}
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
            onPick={(iso) => setStart(toSessionStart({ iso, window }))}
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
        confirmLabel={changing ? "변경" : "확정"}
        confirmColorPalette="success"
        pending={pending}
        onConfirm={submit}
      >
        <ConfirmSessionDialogBody
          windowLabel={windowLabel}
          changing={changing}
          confirmedCount={game.confirmedCount}
          maxPlayers={game.maxPlayers}
        />
      </ConfirmDialog>
    </VStack>
  );
}
