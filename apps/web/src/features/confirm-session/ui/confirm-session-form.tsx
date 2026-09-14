"use client";

import { Button, Text, cn } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { formatDateTime } from "@/shared/lib";
import { ConfirmDialog, EmptyState, toast } from "@/shared/ui";
import { confirmSession } from "../api/confirm-session";

type Candidate = { iso: string; count: number };

const INITIAL_VISIBLE = 3;

// GM 세션 시간 확정(또는 확정 후 변경). 후보를 라디오 목록으로 펴고, 줄마다 가능 인원을 쓴다.
// 확정은 되돌릴 수 없는 동작이라 확인 다이얼로그를 한 번 거친다.
export function ConfirmSessionForm({
  gameId,
  candidates,
  confirmedCount,
  respondedCount,
  currentIso = null,
}: {
  gameId: string;
  // 가능 인원 많은 순 후보
  candidates: Candidate[];
  confirmedCount: number;
  // 가능 시간을 낸 확정 참여자 수
  respondedCount: number;
  // 이미 확정된 시각이 있으면 "확정 시간 변경" 모드
  currentIso?: string | null;
}) {
  const router = useRouter();
  const changing = currentIso !== null;
  const [selected, setSelected] = useState(candidates.find((c) => c.iso !== currentIso)?.iso ?? "");
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
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

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await confirmSession(gameId, selected);
      if (result?.error) {
        setError(result.error);
        setConfirming(false);
        return;
      }
      setConfirming(false);
      toast.success(changing ? "확정 시간을 바꿨습니다" : "세션이 확정되었습니다");
      if (result?.redirect) router.push(result.redirect);
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

      <div role="radiogroup" aria-label={title} className="overflow-hidden rounded-xl border border-gray-200">
        {visible.map((candidate) => {
          const checked = candidate.iso === selected;
          const everyone = confirmedCount > 0 && candidate.count >= confirmedCount;
          const countLabel = everyone ? `${candidate.count}명 전원 가능` : `${candidate.count}명 가능`;
          const isCurrent = candidate.iso === currentIso;
          return (
            // ponytail: 네이티브 라디오를 행 전체 label로 감싼다. 선택 행 룩이 Chip과 달라 손코딩.
            <label
              key={candidate.iso}
              className={cn(
                "flex min-h-13 cursor-pointer items-center gap-3 border-b border-gray-100 px-3 py-2.5 last:border-b-0",
                checked && "bg-tinted-bg",
                isCurrent && "cursor-default",
              )}
            >
              <input
                type="radio"
                name="confirm-slot"
                value={candidate.iso}
                checked={checked}
                disabled={isCurrent}
                onChange={() => setSelected(candidate.iso)}
                className="size-4 accent-primary-600"
              />
              <span className="min-w-0 flex-1">
                <Text typography="subtitle2" className="block">
                  {formatDateTime(candidate.iso)}
                </Text>
                <Text
                  typography="body4"
                  foreground={everyone ? "success" : "muted"}
                  className="block"
                >
                  {isCurrent ? `지금 확정된 시간 · ${countLabel}` : countLabel}
                </Text>
              </span>
            </label>
          );
        })}
      </div>

      {!expanded && candidates.length > INITIAL_VISIBLE && (
        <Button variant="ghost" size="sm" className="mt-1 h-10 w-full" onClick={() => setExpanded(true)}>
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
        {changing ? "이 시간으로 변경" : "이 시간으로 확정"}
      </Button>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={changing ? "확정 시간을 바꿀까요?" : "이 시간으로 확정할까요?"}
        description={
          selected
            ? `${formatDateTime(selected)} · ${
                changing
                  ? "참여자에게 보이는 세션 시간이 바뀝니다."
                  : "확정하면 신청과 명단 조정이 잠깁니다."
              }`
            : undefined
        }
        confirmLabel={changing ? "변경" : "확정"}
        pending={pending}
        onConfirm={submit}
      />
    </section>
  );
}
