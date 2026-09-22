import { Collapsible, Text, VStack } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";

export const TodoMoreOpen = () => (
  <Collapsible.Root defaultOpen>
    <Collapsible.Panel>
      <VStack gap="125" className="pb-125">
        <Text typography="body4">참여자 확정 공지를 올려주세요</Text>
        <Text typography="body4">일정 조율 마감이 내일입니다</Text>
      </VStack>
    </Collapsible.Panel>
    <Collapsible.Trigger className="group flex min-h-[46px] w-full cursor-pointer items-center gap-100 rounded-600 border border-gray-200 px-175 text-left transition-colors hover:bg-gray-50">
      <Text typography="body3" weight="bold" className="flex-1 text-gray-700">
        <span className="group-data-panel-open:hidden">할 일 2건 더 보기</span>
        <span className="hidden group-data-panel-open:inline">접기</span>
      </Text>
      <ChevronDown
        size={16}
        strokeWidth={2.2}
        aria-hidden
        className="text-hint transition-transform group-data-panel-open:rotate-180"
      />
    </Collapsible.Trigger>
  </Collapsible.Root>
);

export const RosterMoreOpen = () => (
  <Collapsible.Root defaultOpen>
    <Collapsible.Panel>
      <VStack gap="125" className="pb-125">
        <Text typography="body4">GM 승인 대기 3명</Text>
        <Text typography="body4">추첨 대기 5명</Text>
        <Text typography="body4">선착순 마감 확정 4명</Text>
      </VStack>
    </Collapsible.Panel>
    <Collapsible.Trigger className="group flex min-h-[46px] w-full cursor-pointer items-center gap-100 rounded-600 border border-gray-200 px-175 text-left transition-colors hover:bg-gray-50">
      <Text typography="body3" weight="bold" className="flex-1 text-gray-700">
        <span className="group-data-panel-open:hidden">참여자 3건 더 보기</span>
        <span className="hidden group-data-panel-open:inline">접기</span>
      </Text>
      <ChevronDown
        size={16}
        strokeWidth={2.2}
        aria-hidden
        className="text-hint transition-transform group-data-panel-open:rotate-180"
      />
    </Collapsible.Trigger>
  </Collapsible.Root>
);
