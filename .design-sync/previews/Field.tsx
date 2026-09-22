import { Field, Textarea, TextInput } from "@roll-and-call/ui";

export const Default = () => (
  <Field.Root
    label="구인 제목"
    htmlFor="field-default-title"
    description="참여자에게 보이는 제목입니다."
  >
    <TextInput id="field-default-title" defaultValue="마지막 열차" />
  </Field.Root>
);

export const Required = () => (
  <Field.Root label="정원" htmlFor="field-required-capacity" required>
    <TextInput id="field-required-capacity" defaultValue="4" />
  </Field.Root>
);

export const Invalid = () => (
  <Field.Root
    label="룰"
    htmlFor="field-invalid-rule"
    required
    error="룰 이름을 입력해 주세요."
  >
    <TextInput id="field-invalid-rule" invalid defaultValue="" placeholder="예: 크툴루의 부름 7판" />
  </Field.Root>
);

export const WithCounter = () => (
  <Field.Root label="시놉시스" htmlFor="field-counter-synopsis" counter="120 / 500">
    <Textarea
      id="field-counter-synopsis"
      defaultValue="어느 폭설 밤, 멈춰버린 열차 안에서 벌어지는 이야기입니다."
    />
  </Field.Root>
);
