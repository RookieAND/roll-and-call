import { Badge, HStack, SegmentedControl, Text } from "@roll-and-call/ui";

import type { GroupBook } from "../model/group-book";
import { GROUP_STATUS_BADGE } from "../model/group-status-badge";

const APPROVE = "approve";
const REJECT = "reject";

interface GroupBookRowProps {
  book: GroupBook;
  rejected: boolean;
  disabled: boolean;
  onRejectedChange: (rejected: boolean) => void;
}

export function GroupBookRow({ book, rejected, disabled, onRejectedChange }: GroupBookRowProps) {
  const decided = book.status !== "pending";
  const badge = GROUP_STATUS_BADGE[book.status];
  const rowTone = rejected ? "bg-danger-50" : "";
  const titleForeground = rejected ? "danger" : "normal";

  return (
    <HStack align="center" gap="125" className={`rounded-400 px-100 py-075 ${rowTone}`}>
      <Text typography="body2" foreground={titleForeground} className="min-w-0 flex-1 break-keep">
        {book.label}
      </Text>
      {decided ? (
        <Badge colorPalette={badge.colorPalette}>{badge.label}</Badge>
      ) : (
        <SegmentedControl.Root
          value={rejected ? REJECT : APPROVE}
          onValueChange={(value) => onRejectedChange(value === REJECT)}
          aria-label={`${book.label} 처리`}
          size="sm"
          fullWidth={false}
          disabled={disabled}
          className="shrink-0"
        >
          <SegmentedControl.Item value={APPROVE}>승인</SegmentedControl.Item>
          <SegmentedControl.Item value={REJECT} colorPalette="danger">
            반려
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      )}
    </HStack>
  );
}
