import { HStack, Text, VStack } from "@roll-and-call/ui";

import { type Fact, Facts, UserInitial } from "@/shared/ui";

import { AsideHeading } from "./aside-heading";

interface GmInfoProps {
  nickname: string;
  meta: string;
  facts: Fact[];
}

export function GmInfo({ nickname, meta, facts }: GmInfoProps) {
  return (
    <VStack render={<section aria-label="GM 정보" />}>
      <AsideHeading>GM 정보</AsideHeading>
      <VStack gap="125" className="p-175">
        <HStack align="center" gap="150">
          <UserInitial nickname={nickname} />
          <VStack gap="025" className="min-w-0">
            <Text typography="heading3" truncate>
              {nickname}
            </Text>
            <Text typography="body4" foreground="hint">
              {meta}
            </Text>
          </VStack>
        </HStack>
        <div className="border-t border-(--rc-color-border-subtle) pt-125">
          <Facts columns={2} items={facts} />
        </div>
      </VStack>
    </VStack>
  );
}
