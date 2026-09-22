import { Avatar, Badge, HStack, Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

const chip = cva("rounded-full border bg-surface py-050 pr-125 pl-050", {
  variants: {
    isGm: { true: "border-primary-200", false: "border-gray-200" },
  },
});

interface SlotMemberChipProps {
  name: string;
  isGm: boolean;
}

export function SlotMemberChip({ name, isGm }: SlotMemberChipProps) {
  return (
    <HStack align="center" gap="075" className={chip({ isGm })}>
      <Avatar size="sm" name={name} />
      <Text typography="body4" weight="medium" render={<span />} className="whitespace-nowrap">
        {name}
      </Text>
      {isGm && (
        <Badge color="primary" className="border border-primary-200 px-075 py-050">
          GM
        </Badge>
      )}
    </HStack>
  );
}
