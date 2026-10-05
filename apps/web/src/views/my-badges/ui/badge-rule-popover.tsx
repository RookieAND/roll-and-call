"use client";

import { Popover, Text } from "@roll-and-call/ui";
import { Info } from "lucide-react";

// 어느 탭에서나 같은 안내다. 업적은 점수가 아니라 세션 횟수 기준이라 점수 규칙은 적지 않는다.
export function BadgeRulePopover() {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="업적 기준 보기"
        className="-mr-050 flex size-11 flex-none items-center justify-center text-hint transition-colors hover:text-muted focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none data-[popup-open]:text-primary"
      >
        <Info size={18} aria-hidden />
      </Popover.Trigger>
      <Popover.Popup side="bottom" align="end">
        <Text
          typography="body3"
          render={<Popover.Description />}
          className="break-keep [text-wrap:pretty]"
        >
          1:1(타이만) 세션은 업적에 세지 않습니다.
        </Text>
      </Popover.Popup>
    </Popover.Root>
  );
}
