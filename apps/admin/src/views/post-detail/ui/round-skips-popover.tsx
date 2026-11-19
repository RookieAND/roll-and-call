import { Button, Popover, Text, VStack } from "@roll-and-call/ui";

import type { AdminRoundSkip } from "../model/admin-rounds";
import { roundSkipText } from "../model/round-skip-text";

export function RoundSkipsPopover({ skips }: { skips: AdminRoundSkip[] }) {
  return (
    <Popover.Root>
      <Popover.Trigger
        render={<Button variant="ghost" colorPalette="gray" size="sm" className="-ml-150" />}
      >
        <Text typography="body4" foreground="hint" className="underline">
          생략한 회차 {skips.length}개
        </Text>
      </Popover.Trigger>
      <Popover.Popup align="start" className="w-[340px] p-100">
        <VStack gap="050">
          {skips.map((skip) => (
            <Text key={skip.roundNo} typography="body3">
              {roundSkipText(skip)}
            </Text>
          ))}
        </VStack>
      </Popover.Popup>
    </Popover.Root>
  );
}
