import { Button, Flex, Text } from "@trpg/ui";

export const Row = () => (
  <Flex align="center" justify="between" gap={3} className="rounded-[14px] border border-gray-200 p-4">
    <Text typography="subtitle1">참여자 3 / 5명</Text>
    <Button size="sm" variant="outline">
      참여자 관리
    </Button>
  </Flex>
);

export const Column = () => (
  <Flex direction="column" gap={2}>
    <Button variant="solid" className="w-full">
      참여하기
    </Button>
    <Button variant="outline" className="w-full">
      일정 조율 보기
    </Button>
  </Flex>
);
