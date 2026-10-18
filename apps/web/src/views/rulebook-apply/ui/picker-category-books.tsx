import { Text, VStack } from "@roll-and-call/ui";

import {
  certApplyHref,
  certOption,
  CERT_OPTION,
  CERT_STATE,
  RULEBOOK_KIND,
  RULEBOOK_KIND_GROUP,
  type MyRulebook,
} from "@/entities/rulebook";
import { useServerPath } from "@/shared/lib";

import { bulkRowNote } from "../model/bulk-row-note";
import { isBulkSelectable } from "../model/bulk-selection";
import { coreNeedNote } from "../model/core-need-note";
import { PickerBookRow } from "./picker-book-row";

interface PickerCategoryBooksProps {
  books: MyRulebook[];
  rulebooks: MyRulebook[];
  bulk: boolean;
  selectedIds: string[];
  limitReached: boolean;
  onToggle: (rulebookId: string) => void;
}

export function PickerCategoryBooks({
  books,
  rulebooks,
  bulk,
  selectedIds,
  limitReached,
  onToggle,
}: PickerCategoryBooksProps) {
  const toServerPath = useServerPath();
  const kinds = Object.values(RULEBOOK_KIND).filter((kind) =>
    books.some((book) => book.kind === kind),
  );
  const needNote = coreNeedNote(books);

  return kinds.map((kind) => (
    <VStack key={kind} gap="100">
      <VStack gap="025">
        <Text typography="body3" weight="bold" foreground="muted">
          {RULEBOOK_KIND_GROUP[kind]}
        </Text>
        {kind === RULEBOOK_KIND.core && needNote && (
          <Text typography="body4" foreground="muted" className="break-keep">
            {needNote}
          </Text>
        )}
      </VStack>
      {books
        .filter((book) => book.kind === kind)
        .map((book) => {
          const option = certOption({ rulebook: book, rulebooks });
          const available = isBulkSelectable({ rulebook: book, rulebooks, selectedIds });
          const withCore = bulk && option.type === CERT_OPTION.needsCore && available;
          const limitBlocked = bulk && limitReached && available && !selectedIds.includes(book.id);
          const note = bulkRowNote({
            limitBlocked,
            withCore,
            needsCoreLocked: bulk && option.type === CERT_OPTION.needsCore && !available,
            fallback: option.note,
          });
          return (
            <PickerBookRow
              key={book.id}
              title={book.shortName}
              edition={book.edition}
              type={option.type}
              note={note}
              noteDanger={limitBlocked}
              selection={
                bulk
                  ? {
                      checked: selectedIds.includes(book.id),
                      available,
                      limitReached,
                      onToggle: () => onToggle(book.id),
                    }
                  : null
              }
              rejected={book.state === CERT_STATE.rejected}
              href={toServerPath(certApplyHref({ rulebookIds: [book.id], step: "photos" }))}
            />
          );
        })}
    </VStack>
  ));
}
