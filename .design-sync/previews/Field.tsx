import { Field, TextInput, Textarea, VStack } from "@trpg/ui";

export const Default = () => (
  <Field label="구인 제목" htmlFor="title" required description="목록과 Discord 공지에 표시됩니다.">
    <TextInput id="title" placeholder="예: 크툴루의 부름 — 안개 속의 저택" />
  </Field>
);

export const WithError = () => (
  <VStack gap={4}>
    <Field label="모집 인원" htmlFor="capacity" required error="1~20 사이 인원을 입력하세요.">
      <TextInput id="capacity" invalid defaultValue="25" />
    </Field>
    <Field label="한 줄 소개" htmlFor="bio">
      <Textarea id="bio" defaultValue="주말 저녁 크툴루 위주로 플레이합니다." />
    </Field>
  </VStack>
);
