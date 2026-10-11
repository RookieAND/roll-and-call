import { Badge, Button, Checkbox, HStack, Text, VStack } from "@roll-and-call/ui";

import type { GroupBook } from "../model/group-book";
import { GROUP_STATUS_BADGE } from "../model/group-status-badge";

interface GroupBookChecklistProps {
  books: GroupBook[];
  uncheckedIds: string[];
  disabled: boolean;
  allChecked: boolean;
  onToggle: (applicationId: string) => void;
  onToggleAll: () => void;
}

export function GroupBookChecklist({
  books,
  uncheckedIds,
  disabled,
  allChecked,
  onToggle,
  onToggleAll,
}: GroupBookChecklistProps) {
  return (
    <VStack
      render={<section aria-label="함께 신청한 책" />}
      className="overflow-hidden rounded-600 border border-gray-200 bg-surface"
    >
      <HStack
        align="center"
        gap="100"
        className="border-b border-(--rc-color-border-subtle) px-150 pt-175 pb-150"
      >
        <VStack gap="050" className="min-w-0 flex-1">
          <Text typography="heading3" render={<h2 />}>
            {`함께 신청한 책 ${books.length}권`}
          </Text>
          <Text typography="body4" foreground="hint" className="break-keep">
            사진에서 제목이 확인된 책을 체크해 주세요. 체크한 책은 승인하고, 체크하지 않은 책은
            반려합니다.
          </Text>
        </VStack>
        <Button variant="ghost" size="sm" disabled={disabled} onClick={onToggleAll}>
          {allChecked ? "모두 해제" : "모두 선택"}
        </Button>
      </HStack>
      <VStack gap="025" className="p-100">
        {books.map((book) => {
          const decided = book.status !== "pending";
          const badge = GROUP_STATUS_BADGE[book.status];
          return (
            <HStack
              key={book.applicationId}
              align="center"
              gap="125"
              render={decided ? <div /> : <label />}
              className="px-050 py-075"
            >
              {decided ? null : (
                <Checkbox.Root
                  checked={!uncheckedIds.includes(book.applicationId)}
                  disabled={disabled}
                  onCheckedChange={() => onToggle(book.applicationId)}
                  aria-label={book.label}
                >
                  <Checkbox.Indicator />
                </Checkbox.Root>
              )}
              <Text typography="body2" className="min-w-0 flex-1">
                {book.label}
              </Text>
              {decided ? <Badge colorPalette={badge.colorPalette}>{badge.label}</Badge> : null}
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}
