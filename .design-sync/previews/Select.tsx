import { Select } from "@roll-and-call/ui";

// Select.Popup은 열렸을 때만 렌더되는 포털이라 정적 캡처에는 잡히지 않는다.
// 트리거의 상태 변화만으로 셀을 구성한다.
const RECRUIT_METHOD_ITEMS = [
  { value: "firstCome", label: "선착순" },
  { value: "lottery", label: "추첨제" },
];

export const Placeholder = () => (
  <Select.Root items={RECRUIT_METHOD_ITEMS}>
    <Select.Trigger placeholder="모집 방식 선택" aria-label="모집 방식" />
  </Select.Root>
);

export const Filled = () => (
  <Select.Root items={RECRUIT_METHOD_ITEMS} defaultValue="firstCome">
    <Select.Trigger aria-label="모집 방식" />
  </Select.Root>
);

export const Invalid = () => (
  <Select.Root items={RECRUIT_METHOD_ITEMS}>
    <Select.Trigger placeholder="모집 방식 선택" invalid aria-label="모집 방식" />
  </Select.Root>
);

export const Disabled = () => (
  <Select.Root items={RECRUIT_METHOD_ITEMS} defaultValue="lottery" disabled>
    <Select.Trigger aria-label="모집 방식" />
  </Select.Root>
);
