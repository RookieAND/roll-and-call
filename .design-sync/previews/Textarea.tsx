import { Field, Textarea } from "@roll-and-call/ui";

export const Default = () => (
  <Field.Root label="시놉시스" htmlFor="textarea-default">
    <Textarea
      id="textarea-default"
      defaultValue="어느 폭설 밤, 멈춰버린 열차 안에서 벌어지는 이야기입니다."
    />
  </Field.Root>
);

export const Invalid = () => (
  <Field.Root
    label="시놉시스"
    htmlFor="textarea-invalid"
    error="시놉시스를 20자 이상 입력해 주세요."
  >
    <Textarea id="textarea-invalid" invalid defaultValue="짧은 소개" />
  </Field.Root>
);

export const Disabled = () => (
  <Field.Root
    label="시놉시스"
    htmlFor="textarea-disabled"
    description="마감된 구인글은 수정할 수 없습니다."
  >
    <Textarea id="textarea-disabled" disabled defaultValue="정원이 찬 세션입니다." />
  </Field.Root>
);
