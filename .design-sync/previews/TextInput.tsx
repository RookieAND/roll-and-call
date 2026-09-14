import { TextInput, VStack } from "@trpg/ui";

export const States = () => (
  <VStack gap={2} className="w-72">
    <TextInput placeholder="시나리오, GM 이름으로 검색" />
    <TextInput defaultValue="크툴루의 부름" />
    <TextInput invalid defaultValue="25" />
    <TextInput disabled defaultValue="수정할 수 없음" />
  </VStack>
);

export const DateTime = () => <TextInput type="datetime-local" defaultValue="2026-09-20T20:00" className="w-72" />;
