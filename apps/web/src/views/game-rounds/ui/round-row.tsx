import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { ChevronRight } from "lucide-react";

import { ServerLink } from "@/shared/ui";

import type { RoundRowView } from "../model/round-row";
import { ROUND_ROW_KIND } from "../model/round-row-kind";
import { ROUND_ROW_STATUS } from "../model/round-row-status";
import { RoundNumberBadge } from "./round-number-badge";

interface RoundRowProps {
  gameId: string;
  view: RoundRowView;
}

const DATED_KINDS: readonly string[] = [
  ROUND_ROW_KIND.finished,
  ROUND_ROW_KIND.inProgress,
  ROUND_ROW_KIND.scheduled,
];

// 끝났거나 진행 중인 회차는 그 회차의 출석 확인으로, 일정이 정해졌거나 조율 중인 회차는 일정 화면으로 간다.
export function RoundRow({ gameId, view }: RoundRowProps) {
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
  const status = ROUND_ROW_STATUS[view.kind];
  const dated = DATED_KINDS.includes(view.kind);
  const content = (
    <HStack align="center" gap="150" className="min-h-16 px-150 py-125">
      <RoundNumberBadge kind={view.kind} roundNo={view.roundNo} />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text
          typography="body2"
          weight={dated ? "bold" : "regular"}
          foreground={dated ? "normal" : "muted"}
        >
          {view.title}
        </Text>
        {view.subtitle && (
          <Text typography="body4" foreground="muted">
            {view.subtitle}
          </Text>
        )}
      </VStack>
      {status && (
        <Badge colorPalette={status.palette} className="flex-none">
          {status.label}
        </Badge>
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
