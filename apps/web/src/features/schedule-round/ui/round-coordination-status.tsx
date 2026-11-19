"use client";

import {
  Avatar,
  Button,
  Card,
  HStack,
  IconButton,
  Popover,
  Progress,
  Text,
  VStack,
} from "@roll-and-call/ui";
import { ChevronRight, Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";

import { ServerLink, toast, toastActionError, useAction } from "@/shared/ui";

import { closeRoundCoordination } from "../api/close-round-coordination";
import { COORDINATION_PHASE } from "../model/coordination-phase";
import { PENDING_NAME_LIMIT } from "../model/pending-names-text";
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

// 가능 시간을 모으는 중(2D)이거나 기간이 끝난 뒤(2E)의 현황. 응답·마감·미응답을 카드 하나에 모으고, 조율 닫기는 ⋯ 메뉴에 둔다.
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
  const shownNames = pendingNames.slice(0, PENDING_NAME_LIMIT);
  const restCount = pendingNames.length - shownNames.length;

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
    <VStack gap="150">
      <Card.Root padding="md" radius={600}>
        <VStack gap="150">
          <HStack justify="between" align="center">
            <Text typography="subtitle1" render={<h3 />}>
              {roundNo}회차 가능 시간
            </Text>
            <Popover.Root>
              <Popover.Trigger render={<IconButton variant="ghost" aria-label="더 보기" />}>
                <Ellipsis size={18} aria-hidden />
              </Popover.Trigger>
              <Popover.Popup side="bottom" align="end">
                <Button variant="ghost" colorPalette="danger" loading={pending} onClick={close}>
                  조율 닫기
                </Button>
              </Popover.Popup>
            </Popover.Root>
          </HStack>
          <VStack gap="075">
            <HStack justify="between" align="baseline">
              <Text typography="body3" foreground="muted">
                응답
              </Text>
              <Text typography="heading3" weight="extrabold" className="tabular-nums">
                {respondedCount} / {totalCount}명
              </Text>
            </HStack>
            <Progress value={respondedCount} max={Math.max(totalCount, 1)} aria-label="응답" />
          </VStack>
          <Text
            typography="body2"
            weight={ended ? "regular" : "bold"}
            foreground={ended ? "muted" : "normal"}
          >
            {ended ? "기간이 끝났습니다" : remainingText({ end, today })}
          </Text>
          {!ended && shownNames.length > 0 && (
            <VStack gap="075">
              <Text typography="body4" foreground="hint">
                미응답
              </Text>
              <HStack gap="075" wrap>
                {shownNames.map((name) => (
                  <HStack
                    key={name}
                    align="center"
                    gap="050"
                    className="rounded-full bg-gray-100 py-050 pr-125 pl-050"
                  >
                    <Avatar name={name} size="sm" />
                    <Text typography="body4">{name}</Text>
                  </HStack>
                ))}
                {restCount > 0 && (
                  <Text typography="body4" foreground="hint" className="self-center">
                    외 {restCount}명
                  </Text>
                )}
              </HStack>
            </VStack>
          )}
          <Button
            variant="ghost"
            colorPalette="gray"
            className="h-12 w-full justify-between border-t border-gray-200 px-0"
            render={<ServerLink path={gridPath} />}
          >
            <Text typography="body2" weight="bold">
              가능 시간 보기
            </Text>
            <ChevronRight size={17} aria-hidden className="text-hint" />
          </Button>
        </VStack>
      </Card.Root>
      <Button size="lg" className="w-full" onClick={() => setMode(ROUND_SCHEDULE_MODE.direct)}>
        결과 보고 정하기
      </Button>
    </VStack>
  );
}
