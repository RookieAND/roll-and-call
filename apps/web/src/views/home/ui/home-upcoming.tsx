import { HStack, Text } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { type SessionCardModel, SessionList } from "@/widgets/session-list";

export function HomeUpcoming({ upcoming }: { upcoming: SessionCardModel[] }) {
  return (
    <section className="flex flex-col gap-2.5">
      <HStack justify="between" align="center">
        <Text typography="heading3" render={<h2 />}>
          다가오는 세션
        </Text>
        <Link href="/me/sessions">
          <Text
            typography="body4"
            foreground="primary"
            className="inline-flex items-center gap-0.5 text-[12.5px] font-semibold"
          >
            내 세션 <ChevronRight size={14} aria-hidden />
          </Text>
        </Link>
      </HStack>
      <SessionList items={upcoming} />
    </section>
  );
}
