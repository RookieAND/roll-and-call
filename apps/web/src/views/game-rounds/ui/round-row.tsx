import { HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { ChevronRight } from "lucide-react";

import { ServerLink } from "@/shared/ui";

import type { RoundRowView } from "../model/round-row";
import { RoundRowIcon } from "./round-row-icon";

interface RoundRowProps {
  gameId: string;
  view: RoundRowView;
}

// 끝났거나 진행 중인 회차는 그 회차의 출석 확인으로 간다.
export function RoundRow({ gameId, view }: RoundRowProps) {
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
      {!isNull(view.attendanceRoundNo) && (
        <ChevronRight size={18} aria-hidden className="flex-none text-hint" />
      )}
    </HStack>
  );
  if (isNull(view.attendanceRoundNo)) return content;
  return (
    <ServerLink
      path={`/games/${gameId}/attendance?round=${view.attendanceRoundNo}`}
      className="block hover:bg-gray-50"
    >
      {content}
    </ServerLink>
  );
}
