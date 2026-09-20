import { Avatar, HStack, Text } from "@trpg/ui";

interface SlotMemberChipProps {
  name: string;
}

export function SlotMemberChip({ name }: SlotMemberChipProps) {
  return (
    <HStack
      align="center"
      gap="075"
      className="rounded-full border border-gray-200 bg-surface py-050 pr-125 pl-050"
    >
      <Avatar size="sm" name={name} />
      <Text typography="body4" weight="medium" render={<span />} className="whitespace-nowrap">
        {name}
      </Text>
    </HStack>
  );
}
