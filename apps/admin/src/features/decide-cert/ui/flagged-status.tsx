import { Text } from "@roll-and-call/ui";

import type { ShotKey } from "@/shared/server";

import { NOTIFY_NOTE } from "../model/notify-note";
import { SHOTS } from "../model/shots";

interface FlaggedStatusProps {
  ebook: boolean;
  reasonTag: string;
  flaggedShots: ShotKey[];
}

export function FlaggedStatus({ ebook, reasonTag, flaggedShots }: FlaggedStatusProps) {
  if (ebook) {
    return (
      <Text typography="body4" foreground="hint">
        {NOTIFY_NOTE}
      </Text>
    );
  }
  if (!reasonTag) {
    return (
      <Text typography="body4" foreground="hint">
        사유를 선택해 주세요
      </Text>
    );
  }
  const labels = SHOTS.filter((shot) => flaggedShots.includes(shot.key as ShotKey)).map(
    (shot) => shot.label,
  );
  return (
    <Text typography="body4" weight="bold" foreground="danger">
      {labels.length
        ? `사유 1개를 선택했고, ${labels.join("·")} 사진을 지정했습니다`
        : "사유 1개를 선택했습니다"}
    </Text>
  );
}
