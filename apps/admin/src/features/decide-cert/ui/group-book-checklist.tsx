import { Button, Grid, HStack, Text, VStack } from "@roll-and-call/ui";

import type { GroupBook } from "../model/group-book";
import { pendingGroupBooks } from "../model/group-selection";
import { GroupBookRow } from "./group-book-row";
import { GroupDecisionSummary } from "./group-decision-summary";

interface GroupBookChecklistProps {
  books: GroupBook[];
  rejectedIds: string[];
  disabled: boolean;
  approveCount: number;
  rejectCount: number;
  onRejectedChange: (params: { bookApplicationId: string; rejected: boolean }) => void;
  onSetAll: (rejected: boolean) => void;
}

export function GroupBookChecklist({
  books,
  rejectedIds,
  disabled,
  approveCount,
  rejectCount,
  onRejectedChange,
  onSetAll,
}: GroupBookChecklistProps) {
  const pendingCount = pendingGroupBooks(books).length;
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
            책마다 승인할지 반려할지 정해 주세요. 사진에서 제목이 확인된 책만 승인합니다.
          </Text>
        </VStack>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled || approveCount === pendingCount}
          onClick={() => onSetAll(false)}
        >
          모두 승인
        </Button>
        <Button
          variant="ghost"
          size="sm"
          colorPalette="danger"
          disabled={disabled || rejectCount === pendingCount}
          onClick={() => onSetAll(true)}
        >
          모두 반려
        </Button>
      </HStack>
      <Grid className="grid-cols-1 gap-x-100 gap-y-025 p-100 min-[900px]:grid-cols-2">
        {books.map((book) => (
          <GroupBookRow
            key={book.applicationId}
            book={book}
            rejected={rejectedIds.includes(book.applicationId)}
            disabled={disabled}
            onRejectedChange={(rejected) =>
              onRejectedChange({ bookApplicationId: book.applicationId, rejected })
            }
          />
        ))}
      </Grid>
      <GroupDecisionSummary approveCount={approveCount} rejectCount={rejectCount} />
    </VStack>
  );
}
