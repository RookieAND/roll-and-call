import { Avatar, Badge, Card, HStack, Text } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";

interface PickedSlotCardProps {
  slotIso: string;
  names: string[];
  gmName?: string;
}

export function PickedSlotCard({ slotIso, names, gmName }: PickedSlotCardProps) {
  return (
    <Card.Root
      radius={500}
      background="none"
      padding="sm"
      className="flex flex-col gap-100 border-tinted-border bg-tinted-bg"
      aria-live="polite"
    >
      <HStack align="baseline" gap="100">
        <Text numeric typography="subtitle1" render={<span />}>
          {formatDateTime(slotIso)}
        </Text>
        <Text numeric typography="subtitle2" foreground="primary" render={<span />}>
          {names.length}명
        </Text>
      </HStack>
      <HStack wrap className="gap-x-150 gap-y-100">
        {names.map((name) => (
          <HStack key={name} align="center" gap="075">
            <Avatar size="sm" name={name} />
            <Text typography="body4" weight="medium" render={<span />}>
              {name}
            </Text>
            {name === gmName && <Badge colorPalette="primary">GM</Badge>}
          </HStack>
        ))}
      </HStack>
    </Card.Root>
  );
}
