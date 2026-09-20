import { Container, Skeleton, Text } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

import { resolveCalendarView } from "../model/resolve-calendar-view";
import { HomeCalendar } from "./home-calendar";

const RECORD_GROUPS = ["gm", "player"] as const;

// 주소만으로 정해지는 글자(달 이름·선택한 날짜·요일)는 로딩 중에도 그대로 보여 준다.
export function HomeSkeleton({ date }: { date?: string }) {
  const { monthStart, selected } = resolveCalendarView(date);

  return (
    <>
      <AppBar title="롤앤콜" brand />
      <Container size="sm" className="px-0">
        <HomeCalendar monthStart={monthStart} />

        <section className="border-t border-gray-200 p-200">
          <div className="mb-150 flex items-baseline gap-100">
            <Text typography="heading3" render={<h3 />} className="font-extrabold">
              {selected.format("M월 D일 (dd)")}
            </Text>
            <Skeleton className="h-[15px] w-8" />
          </div>
          <div className="flex flex-col gap-100">
            <Skeleton className="h-[78px] w-full rounded-600" />
            <Skeleton className="h-[78px] w-full rounded-600" />
          </div>
        </section>

        <section className="border-t border-gray-200 px-200 pt-225 pb-250">
          <Text typography="heading2" render={<h3 />} className="font-extrabold">
            {monthStart.format("M월")}의 기록
          </Text>
          <Skeleton className="mt-050 mb-200 h-[17px] w-48" />
          {RECORD_GROUPS.map((group, index) => (
            <div
              key={group}
              className={index > 0 ? "mt-200 border-t border-gray-100 pt-200" : undefined}
            >
              <Skeleton className="mb-125 h-[15px] w-32" />
              <Skeleton className="h-[74px] rounded-600" />
              <Skeleton className="mt-050 h-[44px]" />
              <Skeleton className="mt-px h-[44px]" />
            </div>
          ))}
        </section>
      </Container>
    </>
  );
}
