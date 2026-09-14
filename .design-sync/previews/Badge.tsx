import { Badge, HStack } from "@trpg/ui";

export const Colors = () => (
  <HStack gap={2} wrap>
    <Badge color="primary">모집 중</Badge>
    <Badge color="success">세션 확정</Badge>
    <Badge color="gray">마감</Badge>
    <Badge color="danger">D-1</Badge>
    <Badge color="discord">Discord</Badge>
  </HStack>
);

export const InContext = () => (
  <HStack gap={2} align="center">
    <Badge color="primary">2회차</Badge>
    <span className="text-sm font-bold text-gray-900">크툴루의 부름 — 안개 속의 저택</span>
  </HStack>
);
