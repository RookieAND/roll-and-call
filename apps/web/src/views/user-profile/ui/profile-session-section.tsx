import { Button, Text } from "@trpg/ui";
import Link from "next/link";

import {
  PROFILE_SESSION_SECTIONS,
  SessionEmptyLine,
  SessionList,
  type SessionCardModel,
  userSessionsHref,
} from "@/widgets/session-list";

const PREVIEW_COUNT = 3;

export function ProfileSessionSection({
  userId,
  section,
  items,
}: {
  userId: string;
  section: (typeof PROFILE_SESSION_SECTIONS)[number];
  items: SessionCardModel[];
}) {
  const hasMore = items.length > PREVIEW_COUNT;

  return (
    <section className="px-4 py-5">
      <div className="mb-2.5 flex items-baseline gap-2.5">
        <Text
          typography="heading3"
          render={<h2 />}
          className="text-[15px] font-extrabold tracking-[-0.015em]"
        >
          {section.title}
        </Text>
        <Text typography="body3" foreground="hint" className="font-bold tabular-nums">
          {items.length}
        </Text>
      </div>
      {items.length === 0 ? (
        <SessionEmptyLine text={section.empty} />
      ) : (
        <div className="flex flex-col gap-2.5">
          <SessionList items={items.slice(0, PREVIEW_COUNT)} />
          {hasMore && (
            <Button asChild variant="outline" className="h-11 w-full">
              <Link href={userSessionsHref(userId, section.key)}>
                {section.title} {items.length}건 모두 보기
              </Link>
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
