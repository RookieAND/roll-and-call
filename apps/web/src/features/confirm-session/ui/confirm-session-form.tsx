"use client";

import { Button, HStack, Text, VStack } from "@trpg/ui";
import { useState } from "react";

import { rankWindows, windowMembers } from "@/entities/availability";
import { slotIso, toKst, type DayColumn } from "@/shared/lib";
import { ConfirmDialog, EmptyState, toast, useAction } from "@/shared/ui";

import { confirmSession } from "../api/confirm-session";
import { toSessionStart } from "../model/session-start";
import { sessionWindowLabel } from "../model/session-window-label";
import { SessionCandidateRow } from "./session-candidate-row";
import { SessionTimeFields } from "./session-time-fields";
import { SessionWindowSummary } from "./session-window-summary";
import { UnavailableWarning } from "./unavailable-warning";

// 후보를 더 늘리면 고르는 일이 다시 읽는 일이 된다. 나머지는 직접 입력 칸으로 간다.
const CANDIDATE_LIMIT = 3;
const DEFAULT_HOUR = 19;

export function ConfirmSessionForm({
  gameId,
  days,
  rangeStart,
  names,
  playMinutes,
  playLabel,
  slotCount,
  confirmedCount,
  currentIso = null,
}: {
  gameId: string;
  days: DayColumn[];
  rangeStart: string;
  names: Record<string, string[]>;
  playMinutes: number;
  playLabel: string;
  slotCount: number;
  confirmedCount: number;
  currentIso?: string | null;
}) {
  const candidates = rankWindows({ names, slotCount, limit: CANDIDATE_LIMIT });
  const respondents = [...new Set(Object.values(names).flat())];
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

  return (
    <VStack gap="250">
      <section>
        <Text typography="subtitle1" render={<h2 />} className="mb-100">
          세션 시간
        </Text>
        <VStack gap="150">
          <SessionTimeFields days={days} start={start} onChange={setStart} />
          <SessionWindowSummary
            windowLabel={sessionWindowLabel(startIso, playMinutes)}
            memberCount={members.length}
          />
          {absentNames.length > 0 && <UnavailableWarning names={absentNames} />}
        </VStack>
      </section>

      <section>
        <HStack align="baseline" gap="100" className="mb-100">
          <Text typography="subtitle1" render={<h2 />}>
            추천 후보
          </Text>
          <Text typography="body4" foreground="hint" render={<span />} className="tabular-nums">
            {candidates.length}개
          </Text>
          <span className="flex-1" />
          <Text typography="body4" foreground="hint" render={<span />}>
            겹치는 인원 순
          </Text>
        </HStack>
        {candidates.length === 0 ? (
          <EmptyState
            size="section"
            image="/empty-states/empty-schedule.png"
            title={`${playLabel}이 연속으로 비는 시간이 없습니다`}
            description={`응답 ${respondents.length}명 기준으로 추천할 후보가 없습니다. 위 세션 시간 칸에서 직접 정하거나, 조율 기간을 늘려 보세요.`}
          />
        ) : (
          <>
            <div className="overflow-hidden rounded-500 border border-gray-200">
              {candidates.map((candidate) => (
                <SessionCandidateRow
                  key={candidate.iso}
                  candidate={candidate}
                  playMinutes={playMinutes}
                  absentNames={respondents.filter((name) => !candidate.members.includes(name))}
                  onPick={(iso) => setStart(toSessionStart(iso))}
                />
              ))}
            </div>
            <Text typography="body4" foreground="hint" render={<p />} className="mt-100">
              체크를 누르면 위 세션 시간 칸이 그 시간으로 채워집니다.
            </Text>
          </>
        )}
      </section>

      {error && (
        <Text typography="body2" foreground="danger" render={<p />}>
          {error}
        </Text>
      )}

      <div className="sticky bottom-0 -mx-200 border-t border-gray-200 bg-surface px-200 py-150">
        <Button
          variant="confirm"
          className="h-[50px] w-full rounded-500"
          onClick={() => setConfirming(true)}
        >
          {startLabel}
          {changing ? "으로 변경" : "으로 확정"}
        </Button>
      </div>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={changing ? "확정 시간을 바꿀까요?" : "이 시간으로 확정할까요?"}
        description={`${sessionWindowLabel(startIso, playMinutes)}\n확정하면 새 신청을 받지 않고, 명단도 고칠 수 없습니다.\n참여자 ${confirmedCount}명에게 디스코드로 알립니다.`}
        confirmLabel={changing ? "변경" : "확정"}
        pending={pending}
        onConfirm={submit}
      />
    </VStack>
  );
}
