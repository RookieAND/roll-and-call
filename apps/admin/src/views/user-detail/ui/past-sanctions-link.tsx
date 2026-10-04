import { Text } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import { pastSanctionsHref } from "../model/past-sanctions-href";

interface PastSanctionsLinkProps {
  nickname: string;
  count: number;
}

export function PastSanctionsLink({ nickname, count }: PastSanctionsLinkProps) {
  return (
    <Text
      typography="body4"
      weight="bold"
      foreground="primary"
      render={<ServerLink path={pastSanctionsHref(nickname)} />}
      className="underline underline-offset-3"
    >
      지난 제재 {count}회
    </Text>
  );
}
