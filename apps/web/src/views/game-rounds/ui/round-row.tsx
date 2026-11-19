import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { ChevronRight } from "lucide-react";

import { ServerLink } from "@/shared/ui";

import type { RoundRowView } from "../model/round-row";
import { ROUND_ROW_KIND } from "../model/round-row-kind";
import { RoundRowIcon } from "./round-row-icon";

interface RoundRowProps {
  gameId: string;
  view: RoundRowView;
}

// 끝났거나 진행 중인 회차는 그 회차의 출석 확인으로, 일정이 정해진 회차는 일정 바꾸기로 간다.
export function RoundRow({ gameId, view }: RoundRowProps) {
  const isScheduleButton =
    view.kind === ROUND_ROW_KIND.unscheduled && !isNull(view.scheduleRoundNo);
  const scheduleHref = `/games/${gameId}/rounds/${view.scheduleRoundNo}/schedule`;
  let href: string | null = null;
  if (!isNull(view.attendanceRoundNo)) {
    href = `/games/${gameId}/attendance?round=${view.attendanceRoundNo}`;
  } else if (
    (view.kind === ROUND_ROW_KIND.scheduled || view.kind === ROUND_ROW_KIND.coordinating) &&
    !isNull(view.scheduleRoundNo)
  ) {
    href = scheduleHref;
  }
  const content = (
    <HStack align="center" gap="125" className="min-h-14 px-150 py-125">
      <RoundRowIcon kind={view.kind} />
      <VStack className="min-w-0 flex-1">
        <Text typography="body2" truncate>
          {view.label}
        </Text>
        {view.note && (
          <Text typography="body4" foreground="hint">
            {view.note}
          </Text>
        )}
      </VStack>
      {isScheduleButton && (
        <Button variant="ghost" size="sm" render={<ServerLink path={scheduleHref} />}>
          {view.scheduleRoundNo}회차 일정 잡기
        </Button>
      )}
      {!isNull(href) && <ChevronRight size={18} aria-hidden className="flex-none text-hint" />}
    </HStack>
  );
  if (isNull(href)) return content;
  return (
    <ServerLink path={href} className="block hover:bg-gray-50">
      {content}
    </ServerLink>
  );
}
