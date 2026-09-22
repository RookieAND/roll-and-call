import { Badge, HStack } from "@roll-and-call/ui";

export const RecruitStatus = () => (
  <HStack gap="100">
    <Badge colorPalette="primary">모집 중</Badge>
    <Badge colorPalette="success">대기 접수 중</Badge>
    <Badge colorPalette="warning">마감 임박</Badge>
    <Badge>마감</Badge>
  </HStack>
);

export const Attendance = () => (
  <HStack gap="100">
    <Badge colorPalette="success">참석</Badge>
    <Badge colorPalette="danger">불참</Badge>
    <Badge colorPalette="discord">디스코드 연동</Badge>
  </HStack>
);
