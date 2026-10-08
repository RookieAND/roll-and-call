import { Text } from "@roll-and-call/ui";

import { OTHER_REASON } from "@/shared/lib";

import { NOTIFY_NOTE } from "../model/notify-note";

interface FlaggedStatusProps {
  reason: string;
  flaggedLabels: string[];
}

export function FlaggedStatus({ reason, flaggedLabels }: FlaggedStatusProps) {
  if (!reason || !flaggedLabels.length) {
    return (
      <Text typography="body4" foreground="hint">
        {NOTIFY_NOTE}
      </Text>
    );
  }
  const picked = reason === OTHER_REASON ? "기타 사유를 입력했고" : "사유 1개를 골랐고";
  return (
    <Text typography="body4" weight="bold" foreground="danger">
      {`${picked}, ${flaggedLabels.join("·")} 사진을 지정했습니다`}
    </Text>
  );
}
