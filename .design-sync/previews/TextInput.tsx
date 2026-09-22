import { Field, TextInput } from "@roll-and-call/ui";

export const Default = () => (
  <Field.Root label="게임명" htmlFor="text-input-default">
    <TextInput id="text-input-default" defaultValue="마지막 열차" />
  </Field.Root>
);

export const Placeholder = () => (
  <Field.Root label="룰" htmlFor="text-input-placeholder">
    <TextInput id="text-input-placeholder" placeholder="예: 크툴루의 부름 7판" />
  </Field.Root>
);

export const Invalid = () => (
  <Field.Root label="정원" htmlFor="text-input-invalid" error="정원은 최소 2명입니다.">
    <TextInput id="text-input-invalid" invalid defaultValue="1" />
  </Field.Root>
);

export const Disabled = () => (
  <Field.Root
    label="모집 방식"
    htmlFor="text-input-disabled"
    description="추첨제 전환 후에는 편집할 수 없습니다."
  >
    <TextInput id="text-input-disabled" disabled defaultValue="선착순" />
  </Field.Root>
);
