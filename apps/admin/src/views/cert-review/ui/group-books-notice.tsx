"use client";

import { Badge, Button, Callout, Collapsible, HStack, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { GROUP_STATUS_BADGE } from "@/features/decide-cert";

import type { GroupBookEntry } from "../model/group-books";
import { summarizeGroupBooks } from "../model/summarize-group-books";
import { GroupBookStatusGroup } from "./group-book-status-group";

interface GroupBooksNoticeProps {
  books: GroupBookEntry[];
}

export function GroupBooksNotice({ books }: GroupBooksNoticeProps) {
  const [expanded, setExpanded] = useState(false);
  const { current, summaryText, groups } = summarizeGroupBooks(books);
  const currentBadge = current ? GROUP_STATUS_BADGE[current.status] : undefined;
  const toggleLabel = expanded ? "목록 접기" : "목록 펼치기";
  const toggleAriaLabel = expanded ? "함께 신청한 책 목록 접기" : "함께 신청한 책 목록 펼치기";

  return (
    <Callout.Root colorPalette="primary">
      <Callout.Icon />
      <Callout.Title>{`사진 한 묶음으로 ${books.length}권을 함께 신청했습니다`}</Callout.Title>
      <Callout.Description>
        <Collapsible.Root open={expanded} onOpenChange={setExpanded}>
          <VStack gap="100">
            <Text typography="body3" foreground="inherit">
              사진에 아래 책이 모두 보이는지 확인해 주세요. 승인과 반려는 책마다 따로 합니다.
            </Text>
            {current && currentBadge ? (
              <HStack align="center" gap="100">
                <Badge colorPalette={currentBadge.colorPalette}>지금 보는 신청</Badge>
                <Text typography="body3" weight="bold" foreground="inherit">
                  {current.label}
                </Text>
              </HStack>
            ) : null}
            <HStack align="center" justify="between" gap="100">
              <Text typography="body3" foreground="inherit">
                {summaryText}
              </Text>
              <Collapsible.Trigger
                render={<Button variant="ghost" colorPalette="gray" size="sm" />}
                aria-label={toggleAriaLabel}
              >
                {toggleLabel}
              </Collapsible.Trigger>
            </HStack>
            <Collapsible.Panel>
              <VStack
                gap="100"
                className="max-h-42 overflow-y-auto border-t border-current/15 pt-100"
              >
                {groups.map((group) => (
                  <GroupBookStatusGroup
                    key={group.status}
                    status={group.status}
                    books={group.books}
                  />
                ))}
              </VStack>
            </Collapsible.Panel>
          </VStack>
        </Collapsible.Root>
      </Callout.Description>
    </Callout.Root>
  );
}
