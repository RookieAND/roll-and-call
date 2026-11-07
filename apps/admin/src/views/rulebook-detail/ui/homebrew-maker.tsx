import { Avatar, HStack, Text } from "@roll-and-call/ui";

import type { HomebrewRuleInfo } from "@/entities/homebrew/server";
import { ServerLink } from "@/shared/ui";

interface HomebrewMakerProps {
  info: Pick<HomebrewRuleInfo, "makerId" | "makerNickname" | "makerAvatarUrl">;
}

// 제작자가 탈퇴했으면 빈 아바타와 「알 수 없음」을 보이고 링크를 걸지 않는다.
export function HomebrewMaker({ info }: HomebrewMakerProps) {
  const { makerId, makerNickname, makerAvatarUrl } = info;
  return (
    <HStack align="center" gap="075" render={<span />} className="min-w-0">
      <Avatar size="sm" src={makerAvatarUrl} name={makerNickname} />
      {makerId && makerNickname ? (
        <Text
          typography="body3"
          weight="bold"
          foreground="primary"
          truncate
          render={<ServerLink path={`/users/${makerId}`} />}
        >
          {makerNickname}
        </Text>
      ) : (
        <Text typography="body3" foreground="muted">
          알 수 없음
        </Text>
      )}
    </HStack>
  );
}
