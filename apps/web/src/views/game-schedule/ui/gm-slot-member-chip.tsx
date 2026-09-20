import { Avatar, Badge, HStack, Text } from "@trpg/ui";

interface GmSlotMemberChipProps {
  name: string;
}

export function GmSlotMemberChip({ name }: GmSlotMemberChipProps) {
  return (
    <HStack
      align="center"
      gap="075"
      className="rounded-full border border-primary-200 bg-surface py-050 pr-125 pl-050"
    >
      <Avatar size="sm" name={name} />
      <Text typography="body4" weight="medium" render={<span />} className="whitespace-nowrap">
        {name}
      </Text>
      <Badge color="primary" className="border border-primary-200 px-075 py-050">
        GM
      </Badge>
    </HStack>
  );
}
