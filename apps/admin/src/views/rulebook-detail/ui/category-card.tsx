import { Badge, Button, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import { RULEBOOK_KIND_LABEL, withQuery } from "@/shared/lib";
import type { RulebookDetail } from "@/shared/server";
import { FactRows, Panel } from "@/shared/ui";

interface CategoryCardProps {
  rulebook: RulebookDetail;
}

// 같은 카테고리의 책을 나열하고 이 책을 강조한다. 아래에는 판본별로 필요한 인증을 적는다.
export function CategoryCard({ rulebook }: CategoryCardProps) {
  const addHref = withQuery("/rules", {}, { add: "1", category: rulebook.category });
  return (
    <Panel
      title={`${rulebook.category} 카테고리`}
      right={<Badge colorPalette="gray">{rulebook.categoryBooks.length}권</Badge>}
    >
      <VStack render={<ul />}>
        {rulebook.categoryBooks.map((book) => {
          const current = book.id === rulebook.id;
          const meta = [
            RULEBOOK_KIND_LABEL[book.kind],
            book.supersedesEdition ? `${book.supersedesEdition} 포함` : null,
            book.certRequired ? null : "인증 불필요",
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <HStack
              key={book.id}
              render={<li />}
              align="center"
              gap="100"
              className={cn(
                "relative border-t border-(--rc-color-border-subtle) px-175 py-125 first:border-t-0",
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
        })}
      </VStack>
      <VStack gap="050" className="border-t border-(--rc-color-border-subtle) px-175 py-125">
        <Text typography="subtitle2">필요한 인증</Text>
        <FactRows
          labelWidth={96}
          items={rulebook.requirements.map((requirement) => ({
            label: requirement.label,
            value: requirement.requirement,
          }))}
        />
      </VStack>
      <div className="border-t border-(--rc-color-border-subtle) px-175 py-125">
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          render={<Link href={addHref} />}
          className="w-full gap-050"
        >
          <Plus size={14} aria-hidden />이 카테고리에 책 추가
        </Button>
      </div>
    </Panel>
  );
}
