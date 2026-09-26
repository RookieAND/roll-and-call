import { Badge, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { RulebookRow } from "@/shared/server";

const KIND_NOTE = {
  core: null,
  supplement: "기본 룰북 인증 후 신청",
  handbook: "GM 자격 없음",
} as const;

interface CategoryBookItemProps {
  book: RulebookRow;
  current: boolean;
}

// 카테고리 카드의 책 한 줄. 지금 보는 책은 강조하고, 다른 책은 그 상세로 간다.
export function CategoryBookItem({ book, current }: CategoryBookItemProps) {
  const meta = [
    RULEBOOK_KIND_LABEL[book.kind],
    KIND_NOTE[book.kind],
    book.certRequired ? null : "인증 불필요",
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <HStack
      render={<li />}
      align="center"
      gap="100"
      className={cn(
        "relative border-t border-(--rc-color-border-subtle) px-175 py-125",
        current && "bg-tinted-bg shadow-[inset_4px_0_0_var(--rc-color-bg-primary)]",
      )}
    >
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="center" gap="075">
          <Text
            typography="subtitle2"
            truncate
            render={current ? undefined : <Link href={`/rules/${book.id}`} />}
            className={current ? undefined : "after:absolute after:inset-0"}
          >
            {book.label}
          </Text>
          {current ? <Badge colorPalette="primary">이 책</Badge> : null}
        </HStack>
        <Text typography="body4" foreground="hint">
          {meta}
        </Text>
      </VStack>
      {current ? null : <ChevronRight size={16} aria-hidden className="text-hint" />}
    </HStack>
  );
}
