import { Badge, HStack, Text } from "@trpg/ui";

export function RosterHeader({
  title,
  methodLabel,
  maxPlayers,
}: {
  title: string;
  methodLabel: string;
  maxPlayers: number;
}) {
  return (
    <HStack align="center" gap={2}>
      <Text typography="heading2" render={<h1 />} className="min-w-0 flex-1 truncate">
        {title}
      </Text>
      <Badge className="shrink-0">{methodLabel}</Badge>
      <Badge className="shrink-0 tabular-nums">정원 {maxPlayers}명</Badge>
    </HStack>
  );
}
