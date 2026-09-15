"use client";

import { Button, Text } from "@trpg/ui";
import { useState } from "react";

import { formatDateTime } from "@/shared/lib";
import { ConfirmDialog, EmptyState, toast, useAction } from "@/shared/ui";

import { confirmSession } from "../api/confirm-session";
import type { SessionCandidate } from "../model/session-candidate";
import { SessionCandidateOption } from "./session-candidate-option";

const INITIAL_VISIBLE = 3;

export function ConfirmSessionForm({
  gameId,
  candidates,
  confirmedCount,
  respondedCount,
  currentIso = null,
}: {
  gameId: string;
  candidates: SessionCandidate[];
  confirmedCount: number;
  respondedCount: number;
  currentIso?: string | null;
}) {
  const changing = currentIso !== null;
  const [selected, setSelected] = useState(
    candidates.find((candidate) => candidate.iso !== currentIso)?.iso ?? "",
  );
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();
  const [error, setError] = useState<string | null>(null);

  const title = changing ? "확정 시간 변경" : "세션 시간 확정";

  if (candidates.length === 0) {
    return (
      <EmptyState
        size="section"
        image="/empty-states/empty-schedule.png"
        title="아직 응답한 참여자가 없습니다"
        description="가능 시간이 모이면 후보가 쌓입니다."
      />
    );
  }

  const visible = expanded ? candidates : candidates.slice(0, INITIAL_VISIBLE);
  const unresponded = Math.max(0, confirmedCount - respondedCount);
  const canExpand = !expanded && candidates.length > INITIAL_VISIBLE;
  const submitLabel = changing ? "이 시간으로 변경" : "이 시간으로 확정";
  const dialogTitle = changing ? "확정 시간을 바꿀까요?" : "이 시간으로 확정할까요?";
  const dialogNote = changing
    ? "참여자에게 보이는 세션 시간이 바뀝니다."
    : "확정하면 신청과 명단 조정이 잠깁니다.";
  const dialogDescription = selected ? `${formatDateTime(selected)} · ${dialogNote}` : undefined;

  function submit() {
    setError(null);
    run(() => confirmSession(gameId, selected), {
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
    <section className="rounded-[14px] border border-gray-200 p-4">
      <Text typography="subtitle1" render={<h2 />}>
        {title}
      </Text>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-0.5 mb-3">
        겹치는 인원이 많은 순입니다.
      </Text>

      <div
        role="radiogroup"
        aria-label={title}
        className="overflow-hidden rounded-xl border border-gray-200"
      >
        {visible.map((candidate) => (
          <SessionCandidateOption
            key={candidate.iso}
            candidate={candidate}
            checked={candidate.iso === selected}
            isCurrent={candidate.iso === currentIso}
            confirmedCount={confirmedCount}
            onSelect={setSelected}
          />
        ))}
      </div>

      {canExpand && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 h-10 w-full"
          onClick={() => setExpanded(true)}
        >
          후보 더 보기
        </Button>
      )}

      {unresponded > 0 && (
        <Text typography="body4" render={<p />} className="mt-2 font-semibold text-warning-600">
          확정 참여자 {unresponded}명이 아직 가능 시간을 내지 않았습니다.
        </Text>
      )}

      {error && (
        <Text typography="body2" foreground="danger" render={<p />} className="mt-3">
          {error}
        </Text>
      )}
      <Button
        variant="confirm"
        className="mt-3 h-[50px] w-full rounded-xl"
        disabled={!selected}
        onClick={() => setConfirming(true)}
      >
        {submitLabel}
      </Button>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={dialogTitle}
        description={dialogDescription}
        confirmLabel={changing ? "변경" : "확정"}
        pending={pending}
        onConfirm={submit}
      />
    </section>
  );
}
