import { Text } from "@roll-and-call/ui";

import type { ShotKey } from "@/shared/server";

import { SHOTS } from "../model/shots";

interface FlaggedStatusProps {
  reasonTag: string;
  flaggedShots: ShotKey[];
}

// "사유 1개를 선택했습니다 · 앞면 사진 지정됨"
export function FlaggedStatus({ reasonTag, flaggedShots }: FlaggedStatusProps) {
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
  const flaggedText = labels.length ? ` · ${labels.join("·")} 사진 지정됨` : "";
  return (
    <Text typography="body4" weight="medium" foreground="danger">
      사유 1개를 선택했습니다{flaggedText}
    </Text>
  );
}
