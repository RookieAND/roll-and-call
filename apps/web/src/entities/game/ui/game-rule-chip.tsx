import { Text } from "@trpg/ui";

interface GameRuleChipProps {
  rule: string;
}

// 룰은 카드 메타 줄에서 유일하게 "무슨 게임인지"를 말한다. 나머지 부속과 섞이지 않게 칩으로 띄운다.
export function GameRuleChip({ rule }: GameRuleChipProps) {
  return (
    <Text
      weight="bold"
      typography="body4"
      tight
      truncate
      className="flex h-5 max-w-[45%] flex-none items-center rounded-200 bg-gray-100 px-100 text-gray-700"
    >
      {rule}
    </Text>
  );
}
