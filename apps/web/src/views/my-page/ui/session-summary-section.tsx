import { HStack, Text, VStack } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { type SessionCardModel, SessionList } from "@/widgets/session-list";

// 미리보기로 보여줄 개수. 나머지는 "더 보기"로 넘긴다.
const PREVIEW = 3;

export function SessionSummarySection({
  title,
  items,
  moreHref,
  empty,
}: {
  title: string;
  items: SessionCardModel[];
  moreHref: string;
  empty: ReactNode;
}) {
  const total = items.length;

  return (
    <VStack gap={2}>
      <HStack justify="between" align="center">
        <HStack gap={1} align="baseline">
          <Text render={<h2 />} className="text-[13.5px] font-extrabold">
            {title}
          </Text>
          <Text typography="code2" foreground="hint">
            {total}
          </Text>
        </HStack>
        {total > 0 && (
          <Link href={moreHref}>
            <Text
              typography="body4"
              foreground="primary"
              className="inline-flex items-center gap-0.5 font-semibold"
            >
              더 보기 <ChevronRight size={14} aria-hidden />
            </Text>
          </Link>
        )}
      </HStack>
      {total === 0 ? empty : <SessionList items={items.slice(0, PREVIEW)} />}
    </VStack>
  );
}
