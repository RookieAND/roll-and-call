import { HStack, Text, VStack } from "@roll-and-call/ui";
import { Hourglass } from "lucide-react";

const PEOPLE_WEEKS_NEEDED = 4;
const GMS_NEEDED = 10;

interface EarlyNoticeProps {
  serviceWeeks: number;
  hostingGms: number;
}

export function EarlyNotice({ serviceWeeks, hostingGms }: EarlyNoticeProps) {
  const pending = [
    {
      title: "참여자 추이",
      condition: `${PEOPLE_WEEKS_NEEDED}주치 기록이 모이면`,
      progress: `${serviceWeeks} / ${PEOPLE_WEEKS_NEEDED}주`,
    },
    {
      title: "GM 분포",
      condition: `GM ${GMS_NEEDED}명 이상이 세션을 진행하면`,
      progress: `${hostingGms} / ${GMS_NEEDED}명`,
    },
  ];
  return (
    <HStack
      align="center"
      gap="400"
      render={<section aria-label="데이터가 더 쌓이면 보여드릴게요" />}
      className="rounded-600 border border-gray-200 bg-surface px-300 py-400"
    >
      <VStack className="w-[300px] shrink-0">
        <span className="mb-125 grid size-[40px] place-items-center rounded-full bg-gray-100 text-hint">
          <Hourglass size={18} aria-hidden />
        </span>
        <Text typography="heading3" render={<h2 />}>
          데이터가 더 쌓이면 보여드릴게요
        </Text>
        <Text typography="body3" foreground="hint" className="mt-050 leading-[1.6]">
          서비스를 시작한 지 {serviceWeeks}주가 지났습니다. 아래 지표는 비교할 만큼 기록이 모이면 이
          자리에 나타납니다.
        </Text>
      </VStack>
      <VStack
        render={<ul />}
        className="min-w-0 flex-1 border-l border-(--rc-color-border-subtle) pl-300"
      >
        {pending.map((item) => (
          <HStack
            key={item.title}
            align="center"
            gap="150"
            render={<li />}
            className="border-t border-(--rc-color-border-subtle) py-125 first:border-t-0"
          >
            <Text typography="body3" weight="bold" className="w-[150px]">
              {item.title}
            </Text>
            <Text typography="body3" foreground="muted" className="flex-1">
              {item.condition}
            </Text>
            <Text typography="body4" weight="bold" foreground="hint" numeric>
              {item.progress}
            </Text>
          </HStack>
        ))}
      </VStack>
    </HStack>
  );
}
