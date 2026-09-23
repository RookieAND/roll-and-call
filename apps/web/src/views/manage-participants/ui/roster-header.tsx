import { Badge, HStack, Text } from "@roll-and-call/ui";

import { RecruitMethodBadge, type RecruitMethod } from "@/entities/game";

interface RosterHeaderProps {
  title: string;
  methodLabel: string;
  recruitMethod: RecruitMethod;
  maxPlayers: number;
}

export function RosterHeader({ title, methodLabel, recruitMethod, maxPlayers }: RosterHeaderProps) {
  return (
    <HStack align="center" gap="075">
      <Text
        typography="heading3"
        weight="extrabold"
        render={<h1 />}
        className="min-w-0 flex-1 truncate"
      >
        {title}
      </Text>
      <RecruitMethodBadge method={recruitMethod} label={methodLabel} />
      <Badge colorPalette="gray" className="tabular-nums">
        정원 {maxPlayers}명
      </Badge>
    </HStack>
  );
}
