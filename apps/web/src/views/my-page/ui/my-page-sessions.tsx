import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import type { summarizeMySessions } from "../model/my-page-summary";
import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";
import { MySessionRow } from "./my-session-row";

interface MyPageSessionsProps {
  sessions: ReturnType<typeof summarizeMySessions>;
}

export function MyPageSessions({ sessions }: MyPageSessionsProps) {
  return (
    <VStack gap="125" render={<section />}>
      <HStack align="center">
        <Text typography="heading3" render={<h2 />} className="flex-1">
          내 세션
        </Text>
        <Button
          render={<Link href={sessions.joined.href} />}
          variant="ghost"
          colorPalette="primary"
          size="sm"
          className="-mr-100"
        >
          전체 보기
        </Button>
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
    </VStack>
  );
}
