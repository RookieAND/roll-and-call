import { Field, Select, VStack } from "@trpg/ui";

const sortItems = [
  { label: "최신순", value: "latest" },
  { label: "마감 임박순", value: "deadline" },
  { label: "남은 자리순", value: "remaining" },
];

const SortSelect = (props: { defaultValue?: string; invalid?: boolean; disabled?: boolean }) => (
  <Select.Root items={sortItems} defaultValue={props.defaultValue} disabled={props.disabled}>
    <Select.Trigger placeholder="정렬 기준 선택" invalid={props.invalid} />
    <Select.Popup>
      {sortItems.map((o) => (
        <Select.Item key={o.value} value={o.value}>
          {o.label}
        </Select.Item>
      ))}
    </Select.Popup>
  </Select.Root>
);

export const Default = () => (
  <Field label="정렬">
    <SortSelect defaultValue="deadline" />
  </Field>
);

export const Placeholder = () => (
  <Field label="정렬" description="목록 정렬 기준을 고르세요.">
    <SortSelect />
  </Field>
);

export const States = () => (
  <VStack gap={4}>
    <Field label="정렬" error="정렬 기준을 선택하세요." required>
      <SortSelect invalid />
    </Field>
    <Field label="정렬 (비활성)">
      <SortSelect defaultValue="latest" disabled />
    </Field>
  </VStack>
);
