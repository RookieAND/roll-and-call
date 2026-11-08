import { Avatar, Badge, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";

interface PickedSlotPeopleProps {
  slotIso: string;
  names: string[];
  gmName?: string;
}

export function PickedSlotPeople({ slotIso, names, gmName }: PickedSlotPeopleProps) {
  return (
    <VStack gap="100" aria-live="polite">
      <HStack align="center" gap="100">
        <Text numeric typography="subtitle2" foreground="primary" render={<span />}>
          {formatDateTime(slotIso)}
        </Text>
        <Badge colorPalette="primary">{names.length}명 가능</Badge>
      </HStack>
      <VStack render={<ul />}>
        {names.map((name) => (
          <HStack
            key={name}
            align="center"
            gap="125"
            className="min-h-11 border-gray-200 not-first:border-t"
            render={<li />}
          >
            <Avatar size="sm" name={name} />
            <Text typography="body2" weight="medium" render={<span />}>
              {name}
            </Text>
            {name === gmName && <Badge colorPalette="primary">GM</Badge>}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
