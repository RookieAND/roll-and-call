import { Badge, Callout, HStack, Text, VStack } from "@roll-and-call/ui";

import type { CertStatus } from "@/shared/server";
import { ServerLink } from "@/shared/ui";

import { GROUP_STATUS_BADGE } from "../model/group-status-badge";

interface GroupBook {
  label: string;
  status: CertStatus;
  current: boolean;
  href: string;
}

interface GroupBooksNoticeProps {
  books: GroupBook[];
}

export function GroupBooksNotice({ books }: GroupBooksNoticeProps) {
  return (
    <Callout.Root colorPalette="primary">
      <Callout.Icon />
      <Callout.Title>{`사진 한 묶음으로 ${books.length}권을 함께 신청했습니다`}</Callout.Title>
      <Callout.Description>
        <VStack gap="100">
          <Text typography="body3" foreground="inherit">
            사진에 아래 책이 모두 보이는지 확인해 주세요. 승인과 반려는 책마다 따로 합니다.
          </Text>
          <VStack gap="050" render={<ul />}>
            {books.map((book) => {
              const badge = GROUP_STATUS_BADGE[book.status];
              return (
                <HStack key={book.href} align="center" gap="100" render={<li />}>
                  {book.current ? (
                    <Text typography="body3" weight="bold" foreground="inherit">
                      {book.label}
                    </Text>
                  ) : (
                    <Text
                      typography="body3"
                      foreground="inherit"
                      render={<ServerLink path={book.href} />}
                    >
                      {book.label}
                    </Text>
                  )}
                  <Badge colorPalette={badge.colorPalette}>
                    {book.current ? "지금 보는 신청" : badge.label}
                  </Badge>
                </HStack>
              );
            })}
          </VStack>
        </VStack>
      </Callout.Description>
    </Callout.Root>
  );
}
