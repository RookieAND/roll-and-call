import { Button, HStack, Text } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { summarizeMySessions } from "../model/my-page-summary";
import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";
import { MySessionRow } from "./my-session-row";

interface MyPageSessionsProps {
  sessions: ReturnType<typeof summarizeMySessions>;
}

export function MyPageSessions({ sessions }: MyPageSessionsProps) {
  return (
    <section className="flex flex-col gap-125">
      <HStack align="center">
        <Text typography="heading3" render={<h2 />} className="flex-1">
          내 세션
        </Text>
        <Link href={sessions.joined.href}>
          <Text
            weight="medium"
            typography="body4"
            foreground="primary"
            className="inline-flex items-center gap-050"
          >
            전체 보기 <ChevronRight size={14} aria-hidden />
          </Text>
        </Link>
      </HStack>

      {/* 세션이 없어도 두 행을 그대로 두고 0으로 쓴다. 점선 빈 상태는 목록 화면 몫이다. */}
      <div className={MY_PAGE_GROUP_CLASS}>
        <MySessionRow
          label="참여"
          count={sessions.joined.count}
          detail={sessions.joined.detail}
          href={sessions.joined.href}
        />
        <MySessionRow
          label="운영"
          count={sessions.hosting.count}
          detail={sessions.hosting.detail}
          urgent={sessions.hosting.urgent}
          href={sessions.hosting.href}
        />
      </div>
      {sessions.isEmpty && (
        <HStack gap="100">
          <Button asChild variant="outline" className="h-11 flex-1">
            <Link href="/games">구인 목록</Link>
          </Button>
          <Button asChild className="h-11 flex-1">
            <Link href="/games/new">새 구인</Link>
          </Button>
        </HStack>
      )}
    </section>
  );
}
