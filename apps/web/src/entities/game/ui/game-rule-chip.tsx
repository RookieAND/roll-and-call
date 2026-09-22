import { Text, cn } from "@roll-and-call/ui";

interface GameRuleChipProps {
  rule: string;
  // 끝난 카드는 아래 줄 전체가 한 단 물러난다.
  dim?: boolean;
  className?: string;
}

// 룰은 카드 아래 줄에서 유일하게 "무슨 게임인지"를 말한다. 나머지 부속과 섞이지 않게 칩으로 띄운다.
export function GameRuleChip({ rule, dim = false, className }: GameRuleChipProps) {
  return (
    <Text
      weight="bold"
      typography="body4"
      tight
      truncate
      className={cn(
        "flex h-6 max-w-[45%] flex-none items-center rounded-300 px-100",
        dim ? "bg-gray-50 text-hint" : "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {rule}
    </Text>
  );
}
