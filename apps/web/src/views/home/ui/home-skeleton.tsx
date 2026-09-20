import { Container, HStack, Skeleton, Text, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

import { resolveCalendarView } from "../model/resolve-calendar-view";
import { HomeCalendar } from "./home-calendar";

const RECORD_GROUPS = ["gm", "player"] as const;

interface HomeSkeletonProps {
  date?: string;
}

// 주소만으로 정해지는 글자(달 이름·선택한 날짜·요일)는 로딩 중에도 그대로 보여 준다.
export function HomeSkeleton({ date }: HomeSkeletonProps) {
  const { monthStart, selected } = resolveCalendarView(date);

  return (
    <>
      <AppBar title="롤앤콜" brand />
      <Container size="sm" className="px-0">
        <HomeCalendar monthStart={monthStart} />

        <section className="border-t border-gray-200 p-200">
          <HStack align="baseline" gap="100" className="mb-150">
            <Text typography="heading3" render={<h3 />} className="font-extrabold">
              {selected.format("M월 D일 (dd)")}
            </Text>
            <Skeleton width={32} height={15} />
          </HStack>
          <VStack gap="100">
            <Skeleton width="100%" height={78} rounded={600} />
            <Skeleton width="100%" height={78} rounded={600} />
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
              <Skeleton width={128} height={15} className="mb-125" />
              <Skeleton height={74} rounded={600} />
              <Skeleton height={44} className="mt-050" />
              <Skeleton height={44} className="mt-px" />
            </div>
          ))}
        </section>
      </Container>
    </>
  );
}
