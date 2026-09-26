"use client";

import { IconButton, Popover, Text, VStack } from "@roll-and-call/ui";
import { Info } from "lucide-react";

export function DrawRulesPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <IconButton variant="ghost" aria-label="추첨 방식 안내" className="text-gray-600" />
        }
      >
        <Info size={16} strokeWidth={2.2} aria-hidden />
      </Popover.Trigger>
      <Popover.Popup side="bottom" align="end">
        <VStack gap="075">
          <Text typography="subtitle2" render={<Popover.Title />}>
            추첨은 이렇게 돌아갑니다
          </Text>
          <Text
            typography="body4"
            foreground="muted"
            render={<Popover.Description />}
            className="text-pretty"
          >
            서버가 신청자마다 1d100을 굴립니다.
            <br />
            낮은 숫자부터 정원만큼 확정되고, 나머지는 대기로 남습니다.
            <br />5 이하는 대성공, 6~19는 극단적 성공으로 표시합니다.
          </Text>
        </VStack>
      </Popover.Popup>
    </Popover.Root>
  );
}
