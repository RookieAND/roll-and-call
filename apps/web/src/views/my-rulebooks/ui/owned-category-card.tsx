"use client";

import { Badge, Card, Collapsible, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";

import type { OwnedCategory } from "../model/to-owned-category";

interface OwnedCategoryCardProps {
  category: OwnedCategory;
  defaultOpen: boolean;
}

// 인증한 룰북 카테고리 한 장. 펼치면 책마다 인증 여부가 나온다.
export function OwnedCategoryCard({ category, defaultOpen }: OwnedCategoryCardProps) {
  return (
    <Card.Root padding="none" className="overflow-hidden">
      <Collapsible.Root defaultOpen={defaultOpen}>
        <Collapsible.Trigger className="group block w-full cursor-pointer p-200 text-left">
          <VStack gap="050">
            <HStack align="center" gap="100">
              <Text typography="subtitle1" className="min-w-0 flex-1 break-keep">
                {category.title}
              </Text>
              <Badge colorPalette={category.badge.palette} className="flex-none">
                {category.badge.label}
              </Badge>
              <ChevronDown
                size={18}
                aria-hidden
                className="flex-none text-hint transition-transform group-data-[panel-open]:rotate-180"
              />
            </HStack>
            <Text typography="body3" foreground="muted" className="break-keep">
              {category.sub}
            </Text>
          </VStack>
        </Collapsible.Trigger>
        <Collapsible.Panel>
          <div className="border-t border-gray-100 bg-gray-50">
            {category.books.map((book) => (
              <HStack
                key={book.key}
                align="center"
                gap="150"
                className="min-h-[60px] border-t border-gray-100 px-200 py-150 first:border-t-0"
              >
                <VStack gap="050" className="min-w-0 flex-1">
                  <Text typography="body2" weight="medium">
                    {book.title}
                  </Text>
                  <Text typography="body4" foreground="hint">
                    {book.meta}
                  </Text>
                </VStack>
                <Badge colorPalette={book.badge.palette} className="flex-none">
                  {book.badge.label}
                </Badge>
              </HStack>
            ))}
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Card.Root>
  );
}
