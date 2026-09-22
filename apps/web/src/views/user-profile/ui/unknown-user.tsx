import { Avatar, HStack, Text } from "@roll-and-call/ui";

export function UnknownUser() {
  return (
    <HStack align="center" gap="175" className="px-200 pt-250 pb-200">
      <Avatar name={null} size="2xl" className="h-16 w-16 text-heading1" />
      <Text typography="heading2" render={<h1 />} className="tracking-[-0.02em]">
        알 수 없는 사용자
      </Text>
    </HStack>
  );
}
