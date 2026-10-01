import { Text, cn } from "@roll-and-call/ui";

interface GameRuleChipProps {
  rule: string;
  dim?: boolean;
  className?: string;
}

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
