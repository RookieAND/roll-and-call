import { Badge, HStack, SegmentedControl, Text, VStack, cn } from "@roll-and-call/ui";

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

// 이미 처리된 책은 토글 대신 뱃지로 보인다. 처리 전에는 책 이름 아래에 승인·반려 토글을 가로로 꽉 채운다. 반려로 고른 책은 줄 배경이 붉어진다.
export function MobileGroupBookRow({
  book,
  rejected,
  disabled,
  onRejectedChange,
}: MobileGroupBookRowProps) {
  const decided = book.status !== "pending";
  const badge = GROUP_STATUS_BADGE[book.status];
  const rowClassName = cn(
    "border-t border-(--rc-color-border-subtle) px-150 py-100 first:border-t-0",
    rejected && "bg-danger-50",
  );
  const label = (
    <Text
      typography="body3"
      weight="medium"
      foreground={rejected ? "danger" : "normal"}
      className="min-w-0 flex-1 break-keep"
    >
      {book.label}
    </Text>
  );
  if (decided) {
    return (
      <HStack align="center" gap="100" className={cn(rowClassName, "min-h-15")}>
        {label}
        <Badge colorPalette={badge.colorPalette}>{badge.label}</Badge>
      </HStack>
    );
  }
  return (
    <VStack gap="075" className={rowClassName}>
      {label}
      <SegmentedControl.Root
        value={rejected ? REJECT : APPROVE}
        onValueChange={(value) => onRejectedChange(value === REJECT)}
        aria-label={`${book.label} 처리`}
        disabled={disabled}
      >
        <SegmentedControl.Item value={APPROVE} colorPalette="success">
          승인
        </SegmentedControl.Item>
        <SegmentedControl.Item value={REJECT} colorPalette="danger">
          반려
        </SegmentedControl.Item>
      </SegmentedControl.Root>
    </VStack>
  );
}
