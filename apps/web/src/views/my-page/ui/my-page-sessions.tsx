import { Button, Text } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { summarizeMySessions } from "../model/my-page-summary";
import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";
import { MySessionRow } from "./my-session-row";

export function MyPageSessions({ sessions }: { sessions: ReturnType<typeof summarizeMySessions> }) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center">
        <Text typography="heading3" render={<h2 />} className="flex-1">
          내 세션
        </Text>
        <Link href={sessions.joined.href}>
          <Text
            typography="body4"
            foreground="primary"
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold"
          >
            전체 보기 <ChevronRight size={14} aria-hidden />
          </Text>
        </Link>
      </div>

      {/* 세션이 없어도 세 행을 0으로 둔다. 점선 빈 상태는 목록 화면 몫이고, 여기선 다음 행동만 단다. */}
      <div className={MY_PAGE_GROUP_CLASS}>
        <MySessionRow
          label="참여 중"
          count={sessions.joined.count}
          detail={sessions.joined.detail}
          href={sessions.joined.href}
        />
        <MySessionRow
          label="내가 운영"
          count={sessions.hosting.count}
          detail={sessions.hosting.detail}
          urgent={sessions.hosting.urgent}
          href={sessions.hosting.href}
        />
        <MySessionRow
          label="끝난 세션"
          count={sessions.past.count}
          detail="기록으로 남습니다"
          href={sessions.past.href}
        />
      </div>
      {sessions.isEmpty && (
        <div className="flex gap-2">
          <Button asChild variant="outline" className="h-11 flex-1">
            <Link href="/games">구인 목록</Link>
          </Button>
          <Button asChild className="h-11 flex-1">
            <Link href="/games/new">새 구인</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
