import { Badge, HStack, Text } from "@trpg/ui";

export function RosterHeader({
  title,
  methodLabel,
  isLottery,
  maxPlayers,
}: {
  title: string;
  methodLabel: string;
  isLottery: boolean;
  maxPlayers: number;
}) {
  return (
    <HStack align="center" gap="100">
      <Text typography="heading2" render={<h1 />} className="min-w-0 flex-1 truncate">
        {title}
      </Text>
      <Badge color={isLottery ? "primary" : "gray"} className="shrink-0">
        {methodLabel}
      </Badge>
      <Badge className="shrink-0 tabular-nums">정원 {maxPlayers}명</Badge>
    </HStack>
  );
}
