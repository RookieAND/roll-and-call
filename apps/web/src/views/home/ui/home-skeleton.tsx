"use client";

import { Container, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AppBar, HelpButton } from "@/shared/ui";

import { resolveCalendarView } from "../model/resolve-calendar-view";
import { HomeCalendar } from "./home-calendar";

const RECORD_GROUPS = ["gm", "player"] as const;

interface HomeSkeletonProps {
  date?: string;
}

export function HomeSkeleton({ date }: HomeSkeletonProps) {
  const { monthStart, selected } = resolveCalendarView(date);

  return (
    <>
      <AppBar title="롤앤콜" brand action={<HelpButton />} />
      <Container size="sm" className="max-w-3xl px-0">
        <HomeCalendar monthStart={monthStart} />

        <section className="border-t border-gray-200 p-200">
          <Text typography="heading3" render={<h3 />} className="mb-150 font-extrabold">
            {selected.format("M월 D일 (dd)")}
          </Text>
          <VStack gap="100">
            <Skeleton width="100%" height={72} rounded={600} />
            <Skeleton width="100%" height={72} rounded={600} />
          </VStack>
        </section>

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
              <Skeleton width={120} height={14} className="mb-125" />
              <Skeleton height={76} rounded={600} />
              <Skeleton height={28} className="mt-050" />
              <Skeleton height={28} className="mt-050" />
            </div>
          ))}
        </section>
      </Container>
    </>
  );
}
