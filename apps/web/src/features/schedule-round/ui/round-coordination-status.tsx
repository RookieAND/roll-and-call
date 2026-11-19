"use client";

import { Button, Callout, Text, VStack } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { ServerLink, toast, toastActionError, useAction } from "@/shared/ui";

import { closeRoundCoordination } from "../api/close-round-coordination";
import { COORDINATION_PHASE } from "../model/coordination-phase";
import { pendingNamesText } from "../model/pending-names-text";
import { remainingText } from "../model/remaining-text";
import { ROUND_SCHEDULE_MODE } from "../model/round-schedule-mode";
import { useRoundScheduleMode } from "../model/use-round-schedule-mode";

interface RoundCoordinationStatusProps {
  gameId: string;
  roundNo: number;
  phase: typeof COORDINATION_PHASE.open | typeof COORDINATION_PHASE.ended;
  end: string;
  today: string;
  respondedCount: number;
  totalCount: number;
  pendingNames: readonly string[];
  gridPath: string;
}

// 가능 시간을 모으는 중(2D)이거나 기간이 끝난 뒤(2E)의 현황.
export function RoundCoordinationStatus({
  gameId,
  roundNo,
  phase,
  end,
  today,
  respondedCount,
  totalCount,
  pendingNames,
  gridPath,
}: RoundCoordinationStatusProps) {
  const router = useRouter();
  const { pending, run } = useAction();
  const { setMode } = useRoundScheduleMode();
  const ended = phase === COORDINATION_PHASE.ended;
  const pendingLine = pendingNamesText(pendingNames);

  function close() {
    run(() => closeRoundCoordination({ gameId, roundNo }), {
      onSuccess: () => {
        toast.success("조율을 닫았습니다.");
        router.refresh();
      },
      onError: toastActionError,
    });
  }

  return (
    <VStack gap="200">
      <VStack gap="050">
        {ended ? (
          <Callout.Root colorPalette="gray">
            <Callout.Icon />
            <Callout.Description>가능 시간 입력이 끝났습니다.</Callout.Description>
          </Callout.Root>
        ) : (
          <Text typography="body2" weight="bold">
            {remainingText({ end, today })}
          </Text>
        )}
        <Text typography="body3" foreground="muted">
          응답 {respondedCount}/{totalCount}명
        </Text>
        {!ended && pendingLine && (
          <Text typography="body4" foreground="hint">
            {pendingLine}
          </Text>
        )}
      </VStack>
      <VStack gap="100">
        <Button size="lg" className="w-full" onClick={() => setMode(ROUND_SCHEDULE_MODE.direct)}>
          결과 보고 정하기
        </Button>
        <Button variant="outline" className="w-full" render={<ServerLink path={gridPath} />}>
          가능 시간 보기
        </Button>
        <Button variant="ghost" colorPalette="gray" loading={pending} onClick={close}>
          조율 닫기
        </Button>
      </VStack>
    </VStack>
  );
}
