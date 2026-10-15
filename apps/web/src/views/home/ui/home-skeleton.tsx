"use client";

import { Skeleton, Text } from "@roll-and-call/ui";

import { AppBar, DESKTOP_CARD_CLASS, HelpButton } from "@/shared/ui";

import { resolveCalendarView } from "../model/resolve-calendar-view";
import { HomeCalendar } from "./home-calendar";
import { HomeDaySessionsSkeleton } from "./home-day-sessions-skeleton";
import { HomeLayout } from "./home-layout";

const RECORD_GROUPS = ["gm", "player"] as const;

interface HomeSkeletonProps {
  date?: string;
}

export function HomeSkeleton({ date }: HomeSkeletonProps) {
  const { monthStart, selected } = resolveCalendarView(date);

  return (
    <HomeLayout
      appBar={<AppBar title="롤앤콜" desktopTitle="홈" brand action={<HelpButton />} />}
      panel={
        <div className={`${DESKTOP_CARD_CLASS} p-200`}>
          <HomeDaySessionsSkeleton date={selected.format("M월 D일 (dd)")} />
        </div>
      }
    >
      <div className={DESKTOP_CARD_CLASS}>
        <HomeCalendar monthStart={monthStart} />
        <div className="border-t border-gray-200 p-200 desktop:hidden">
          <HomeDaySessionsSkeleton date={selected.format("M월 D일 (dd)")} />
        </div>
      </div>

      <div className={`${DESKTOP_CARD_CLASS} desktop:mt-300`}>
        <section className="border-t border-gray-200 px-200 pt-225 pb-250">
          <Text typography="heading2" render={<h3 />} className="font-extrabold">
            {monthStart.format("M월")}의 기록
          </Text>
          <Skeleton width={192} height={17} className="mt-050 mb-200" />
          {RECORD_GROUPS.map((group, index) => (
            <div
              key={group}
              className={index > 0 ? "mt-200 border-t border-gray-100 pt-200" : undefined}
            >
              <Skeleton width={128} height={15} className="mb-125" />
              <Skeleton height={74} rounded={600} />
              <Skeleton height={44} className="mt-050" />
              <Skeleton height={44} className="mt-px" />
            </div>
          ))}
        </section>
      </div>
    </HomeLayout>
  );
}
