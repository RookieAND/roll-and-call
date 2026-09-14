"use client";

import { Avatar, Button, Text, VStack, cn } from "@trpg/ui";
import { useState, useTransition } from "react";
import { PARTICIPANT_STATUS } from "@/entities/game";
import { Sheet, toast } from "@/shared/ui";
import { swapParticipants } from "../api/adjust-roster";
import type { MemberSummary } from "../model/member-summary";
import { toastWithUndo } from "./undo-toast";

type Candidate = MemberSummary & { hasAvailability: boolean };

// 교체 시트: 정원이 찬 상태에서 대기자(incoming)를 올릴 자리를 고른다. GM은 내릴 사람만 고르면 된다.
// 조율형이면 가능 시간을 내지 않은 사람을 맨 위에 둬서, 대개 맞는 선택이 첫 줄에 오게 한다.
export function SwapSheet({
  gameId,
  incoming,
  candidates,
  maxPlayers,
  isCoordinate,
  onClose,
}: {
  gameId: string;
  incoming: MemberSummary | null;
  candidates: Candidate[];
  maxPlayers: number;
  isCoordinate: boolean;
  onClose: () => void;
}) {
  const [outId, setOutId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const sorted = candidates.toSorted(
    (a, b) =>
      (isCoordinate ? Number(a.hasAvailability) - Number(b.hasAvailability) : 0) ||
      a.applicationRank - b.applicationRank,
  );
  const outgoing = candidates.find((c) => c.userId === outId);

  function close() {
    setOutId(null);
    onClose();
  }

  function submit() {
    if (!incoming || !outgoing) return;
    startTransition(async () => {
      const result = await swapParticipants(gameId, incoming.userId, outgoing.userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toastWithUndo(
        `${incoming.username}님을 확정하고 ${outgoing.username}님을 대기로 옮겼습니다`,
        gameId,
        [
          { userId: incoming.userId, status: PARTICIPANT_STATUS.waiting },
          { userId: outgoing.userId, status: PARTICIPANT_STATUS.confirmed },
        ],
      );
      close();
    });
  }

  return (
    <Sheet.Root open={incoming !== null} onOpenChange={(open) => !open && close()}>
      <Sheet.Content>
        {incoming && (
          <VStack gap={3}>
            <VStack gap={1}>
              <Sheet.Title className="mb-0 text-base text-gray-900">
                {incoming.username}님을 올릴 자리 고르기
              </Sheet.Title>
              <Text typography="body3" foreground="muted" render={<p />}>
                정원이 {maxPlayers}명으로 차 있습니다. 내릴 사람을 고르면 그 자리에 {incoming.username}
                님이 들어가고, 고른 사람은 대기로 옮겨집니다.
              </Text>
            </VStack>

            <div role="radiogroup" aria-label="내릴 사람" className="overflow-hidden rounded-xl border border-gray-200">
              {sorted.map((c) => {
                const checked = c.userId === outId;
                const availability = isCoordinate
                  ? `가능 시간 ${c.hasAvailability ? "제출" : "미제출"} · `
                  : "";
                return (
                  // ponytail: 네이티브 라디오를 행 전체 label로 감싼다. 선택 행 룩이 Chip과 달라 손코딩.
                  <label
                    key={c.userId}
                    className={cn(
                      "flex min-h-14 cursor-pointer items-center gap-3 border-b border-gray-100 px-3 py-2 last:border-b-0",
                      checked && "bg-tinted-bg",
                    )}
                  >
                    <input
                      type="radio"
                      name="swap-out"
                      value={c.userId}
                      checked={checked}
                      onChange={() => setOutId(c.userId)}
                      className="size-4 accent-primary-600"
                    />
                    <Avatar src={c.avatarUrl} name={c.username} />
                    <div className="min-w-0 flex-1">
                      <Text typography="subtitle2" className="block truncate">
                        {c.username}
                      </Text>
                      <Text
                        typography="body4"
                        foreground="hint"
                        className={cn("block", isCoordinate && !c.hasAvailability && "text-warning-600")}
                      >
                        {availability}
                        {c.applicationRank}번째 신청
                      </Text>
                    </div>
                  </label>
                );
              })}
            </div>
            {isCoordinate && (
              <Text typography="body4" foreground="hint" render={<p />}>
                가능 시간을 내지 않은 사람을 맨 위에 둡니다.
              </Text>
            )}

            <div className="flex gap-2 [&>*]:flex-1">
              <Button variant="outline" className="h-11" onClick={close} disabled={pending}>
                취소
              </Button>
              <Button className="h-11" disabled={!outgoing} loading={pending} onClick={submit}>
                교체하기
              </Button>
            </div>
          </VStack>
        )}
      </Sheet.Content>
    </Sheet.Root>
  );
}
