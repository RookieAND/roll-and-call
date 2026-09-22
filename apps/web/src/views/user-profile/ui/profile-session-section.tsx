import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import type { SessionRole } from "@/entities/game";
import {
  SessionEmptyLine,
  SessionList,
  userSessionsHref,
  type SessionCardModel,
} from "@/widgets/session-list";

const PREVIEW_COUNT = 3;

interface ProfileSessionSectionProps {
  userId: string;
  section: { key: SessionRole; title: string; empty: string };
  items: SessionCardModel[];
}

// 탭을 쓰지 않는다. 두 목록을 한 번에 훑는 화면이고, 세 건짜리 목록을 탭 뒤에 숨길 이유가 없다.
export function ProfileSessionSection({ userId, section, items }: ProfileSessionSectionProps) {
  const hasMore = items.length > PREVIEW_COUNT;

  return (
    <section className="px-200 py-250">
      <HStack align="baseline" gap="125" className="mb-125">
        <Text
          typography="heading3"
          weight="extrabold"
          render={<h2 />}
          className="tracking-[-0.015em]"
        >
          {section.title}
        </Text>
        <Text numeric weight="bold" typography="body3" foreground="hint">
          {items.length}
        </Text>
      </HStack>
      {items.length === 0 ? (
        <SessionEmptyLine text={section.empty} />
      ) : (
        <VStack gap="125">
          <SessionList items={items.slice(0, PREVIEW_COUNT)} />
          {hasMore && (
            <Button asChild variant="outline" className="h-11 w-full">
              <Link href={userSessionsHref(userId, section.key)}>
                {section.title} 세션 {items.length}건 모두 보기
              </Link>
            </Button>
          )}
        </VStack>
      )}
    </section>
  );
}
