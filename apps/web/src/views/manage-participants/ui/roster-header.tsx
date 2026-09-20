import { Badge, HStack, Text } from "@trpg/ui";

import { FirstComeMethodBadge } from "./first-come-method-badge";
import { LotteryMethodBadge } from "./lottery-method-badge";

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
      {isLottery ? (
        <LotteryMethodBadge label={methodLabel} />
      ) : (
        <FirstComeMethodBadge label={methodLabel} />
      )}
      <Badge className="shrink-0 tabular-nums">정원 {maxPlayers}명</Badge>
    </HStack>
  );
}
