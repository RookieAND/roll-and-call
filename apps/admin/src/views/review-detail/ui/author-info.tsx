import { HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDate } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { Facts, UserInitial } from "@/shared/ui";

import { AsideHeading } from "./aside-heading";

interface AuthorInfoProps {
  author: ReviewDetail["author"];
}

export function AuthorInfo({ author }: AuthorInfoProps) {
  const actionCount = author.hideCount + author.removeCount;
  const actionSummary = [
    author.hideCount ? `숨김 ${author.hideCount}` : null,
    author.removeCount ? `제거 ${author.removeCount}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <VStack render={<section aria-label="작성자" />}>
      <AsideHeading className="border-t">작성자</AsideHeading>
      <VStack gap="125" className="p-175">
        <HStack align="center" gap="150">
          <UserInitial nickname={author.nickname} />
          <VStack gap="025" className="min-w-0">
            <Text typography="heading3" truncate>
              {author.nickname}
            </Text>
            <Text typography="body4" foreground="hint">
              {formatDate(author.joinedAt)} 가입
            </Text>
          </VStack>
        </HStack>
        <VStack className="border-t border-(--rc-color-border-subtle) pt-125">
          <Facts
            columns={2}
            items={[
              { label: "쓴 후기", value: `${author.reviewCount}개` },
              {
                label: "받은 조치",
                value: actionCount ? `${actionCount}회` : "없음",
                danger: actionCount > 0,
                sub: actionCount ? actionSummary : undefined,
              },
            ]}
          />
        </VStack>
      </VStack>
    </VStack>
  );
}
