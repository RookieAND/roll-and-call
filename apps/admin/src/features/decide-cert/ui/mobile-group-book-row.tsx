import { Badge, HStack, SegmentedControl, Text, cn } from "@roll-and-call/ui";

import type { GroupBook } from "../model/group-book";
import { GROUP_STATUS_BADGE } from "../model/group-status-badge";

const APPROVE = "approve";
const REJECT = "reject";

interface MobileGroupBookRowProps {
  book: GroupBook;
  rejected: boolean;
  disabled: boolean;
  onRejectedChange: (rejected: boolean) => void;
}

// 이미 처리된 책은 토글 대신 뱃지로 보인다. 반려로 고른 책은 줄 배경이 붉어진다.
export function MobileGroupBookRow({
  book,
  rejected,
  disabled,
  onRejectedChange,
}: MobileGroupBookRowProps) {
  const decided = book.status !== "pending";
  const badge = GROUP_STATUS_BADGE[book.status];
  return (
    <HStack
      align="center"
      gap="100"
      className={cn(
        "min-h-15 border-t border-(--rc-color-border-subtle) px-150 py-075 first:border-t-0",
        rejected && "bg-danger-50",
      )}
    >
      <Text
        typography="body3"
        weight="medium"
        foreground={rejected ? "danger" : "normal"}
        className="min-w-0 flex-1 break-keep"
      >
        {book.label}
      </Text>
      {decided ? (
        <Badge colorPalette={badge.colorPalette}>{badge.label}</Badge>
      ) : (
        <SegmentedControl.Root
          value={rejected ? REJECT : APPROVE}
          onValueChange={(value) => onRejectedChange(value === REJECT)}
          aria-label={`${book.label} 처리`}
          fullWidth={false}
          disabled={disabled}
          className="w-33 shrink-0"
        >
          <SegmentedControl.Item value={APPROVE} colorPalette="success">
            승인
          </SegmentedControl.Item>
          <SegmentedControl.Item value={REJECT} colorPalette="danger">
            반려
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      )}
    </HStack>
  );
}
