import { Button, Text } from "@trpg/ui";
import Link from "next/link";

import { toKst } from "@/shared/lib";
import { EmptyState } from "@/shared/ui";

import type { CalendarSession } from "../model/to-calendar-sessions";
import { HomeSessionCard } from "./home-session-card";

export function HomeDaySessions({ date, sessions }: { date: Date; sessions: CalendarSession[] }) {
  const title = toKst(date).format("M월 D일 (dd)");
  const countLabel = sessions.length > 0 ? `${sessions.length}건` : "세션 없음";

  return (
    <section className="border-t border-gray-200 p-4">
      <div className="mb-[11px] flex items-baseline gap-2">
        <Text typography="heading3" render={<h3 />} className="font-extrabold">
          {title}
        </Text>
        <Text typography="body3" foreground="hint" className="tabular-nums">
          {countLabel}
        </Text>
      </div>
      {sessions.length === 0 ? (
        <EmptyState
          size="section"
          className="p-4"
          title="이 날 잡힌 세션이 없습니다"
          description={
            <>
              모집 중인 글은 구인 목록에 있습니다.
              <br />
              일정이 확정되면 달력에 올라옵니다.
            </>
          }
          action={
            <Button asChild variant="outline" className="h-11 w-full">
              <Link href="/games">구인 목록 보기</Link>
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {sessions.map((session) => (
            <Link key={session.id} href={`/games/${session.id}`} className="block">
              <HomeSessionCard session={session} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
