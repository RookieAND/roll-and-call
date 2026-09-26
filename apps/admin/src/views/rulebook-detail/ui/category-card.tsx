import { Badge, Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import Link from "next/link";

import { withQuery } from "@/shared/lib";
import type { RulebookDetail } from "@/shared/server";
import { Panel } from "@/shared/ui";

import { CategoryBookItem } from "./category-book-item";
import { GmCondition } from "./gm-condition";

interface CategoryCardProps {
  rulebook: RulebookDetail;
}

// 같은 카테고리의 책을 판본별로 묶고, 판본마다 GM 조건을 책 배지 조합으로 보여 준다. 이 책은 강조한다.
export function CategoryCard({ rulebook }: CategoryCardProps) {
  const addHref = withQuery("/rules", {}, { add: "1", category: rulebook.category });
  return (
    <Panel
      title={`${rulebook.category} 카테고리`}
      right={<Badge colorPalette="gray">{rulebook.categoryBooks.length}권</Badge>}
    >
      {rulebook.editions.map((edition, index) => (
        <section
          key={edition.edition}
          className={index > 0 ? "border-t border-gray-200" : undefined}
        >
          <VStack gap="075" className="bg-(--rc-color-bg-canvas-raised) px-175 py-125">
            <Text typography="subtitle2" render={<h3 />}>
              {edition.edition || "판본 없음"}
            </Text>
            <HStack align="start" gap="100">
              <Text
                typography="body4"
                weight="bold"
                foreground="muted"
                className="shrink-0 leading-[22px]"
              >
                GM 조건
              </Text>
              <GmCondition edition={edition} />
            </HStack>
          </VStack>
          <VStack render={<ul />}>
            {edition.books.map((book) => (
              <CategoryBookItem key={book.id} book={book} current={book.id === rulebook.id} />
            ))}
          </VStack>
        </section>
      ))}
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
