import { Text } from "@roll-and-call/ui";

interface FlaggedStatusProps {
  reason: string;
  flaggedLabels: string[];
}

export function FlaggedStatus({ reason, flaggedLabels }: FlaggedStatusProps) {
  if (!reason) {
    return (
      <Text typography="body4" foreground="hint">
        사유를 선택해 주세요
      </Text>
    );
  }
  const photos = flaggedLabels.length ? ` · ${flaggedLabels.join("·")} 사진 지정됨` : "";
  return (
    <Text typography="body4" weight="bold" foreground="danger">
      {`사유 1개를 선택했습니다${photos}`}
    </Text>
  );
}
