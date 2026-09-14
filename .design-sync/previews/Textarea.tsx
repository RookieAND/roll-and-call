import { Textarea, VStack } from "@trpg/ui";

export const States = () => (
  <VStack gap={2} className="w-72">
    <Textarea placeholder="시나리오 소개, 준비물, 하우스룰을 적어 주세요." />
    <Textarea
      invalid
      defaultValue="한 줄 소개가 200자를 넘으면 이렇게 표시됩니다."
    />
  </VStack>
);
