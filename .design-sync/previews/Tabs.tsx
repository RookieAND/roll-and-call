import { Tabs } from "@roll-and-call/ui";

export const LineVariant = () => (
  <Tabs.Root defaultValue="notice" className="w-72">
    <Tabs.List aria-label="게임 상세 탭">
      <Tabs.Trigger value="notice">공지</Tabs.Trigger>
      <Tabs.Trigger value="participants">참여자</Tabs.Trigger>
      <Tabs.Trigger value="schedule">일정 조율</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Panel value="notice">모집 마감까지 2일 남았습니다.</Tabs.Panel>
    <Tabs.Panel value="participants">참여자 4명이 확정되었습니다.</Tabs.Panel>
    <Tabs.Panel value="schedule">일정 조율이 진행 중입니다.</Tabs.Panel>
  </Tabs.Root>
);

export const SelectedSecondTab = () => (
  <Tabs.Root defaultValue="schedule" className="w-72">
    <Tabs.List aria-label="게임 상세 탭 (일정 조율 선택)">
      <Tabs.Trigger value="notice">공지</Tabs.Trigger>
      <Tabs.Trigger value="participants">참여자</Tabs.Trigger>
      <Tabs.Trigger value="schedule">일정 조율</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Panel value="notice">모집 마감까지 2일 남았습니다.</Tabs.Panel>
    <Tabs.Panel value="participants">참여자 4명이 확정되었습니다.</Tabs.Panel>
    <Tabs.Panel value="schedule">일정 조율이 진행 중입니다.</Tabs.Panel>
  </Tabs.Root>
);

export const SolidVariant = () => (
  <Tabs.Root defaultValue="waiting" className="w-72">
    <Tabs.List variant="solid" scrollable={false} aria-label="참여 상태 탭">
      <Tabs.Trigger value="confirmed">확정</Tabs.Trigger>
      <Tabs.Trigger value="waiting">대기</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Panel value="confirmed">확정된 참여자 목록입니다.</Tabs.Panel>
    <Tabs.Panel value="waiting">대기 중인 참여자 목록입니다.</Tabs.Panel>
  </Tabs.Root>
);
