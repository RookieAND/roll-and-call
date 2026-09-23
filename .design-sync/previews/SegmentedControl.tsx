import { SegmentedControl, VStack } from "@roll-and-call/ui";

export const GameFilter = () => (
  <SegmentedControl.Root value="open" onValueChange={() => {}} aria-label="구인 상태">
    <SegmentedControl.Item value="all">전체</SegmentedControl.Item>
    <SegmentedControl.Item value="open">모집 중</SegmentedControl.Item>
    <SegmentedControl.Item value="waiting">대기 접수 중</SegmentedControl.Item>
    <SegmentedControl.Item value="closed">마감</SegmentedControl.Item>
  </SegmentedControl.Root>
);

export const AttendanceAnswer = () => (
  <VStack gap="150">
    <SegmentedControl.Root value="present" onValueChange={() => {}} aria-label="참석 여부">
      <SegmentedControl.Item value="present" colorPalette="success">
        참석
      </SegmentedControl.Item>
      <SegmentedControl.Item value="absent" colorPalette="danger">
        불참
      </SegmentedControl.Item>
    </SegmentedControl.Root>
    <SegmentedControl.Root value="absent" onValueChange={() => {}} aria-label="참석 여부 (불참)">
      <SegmentedControl.Item value="present" colorPalette="success">
        참석
      </SegmentedControl.Item>
      <SegmentedControl.Item value="absent" colorPalette="danger">
        불참
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  </VStack>
);

export const ReadOnly = () => (
  <SegmentedControl.Root value="present" onValueChange={() => {}} disabled aria-label="확정된 응답">
    <SegmentedControl.Item value="present" colorPalette="success">
      참석
    </SegmentedControl.Item>
    <SegmentedControl.Item value="absent" colorPalette="danger">
      불참
    </SegmentedControl.Item>
  </SegmentedControl.Root>
);
