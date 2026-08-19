import { Text } from "@trpg/ui";

// 참여/정원 인원 표시(현재/최대). 굵은 tabular 숫자.
export function GameSeatCount({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  return (
    <Text size="sm" weight="bold" className="tabular-nums text-gray-700">
      {current}/{max}
    </Text>
  );
}
