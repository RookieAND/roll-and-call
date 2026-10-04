import { HStack, Text } from "@roll-and-call/ui";
import { CircleAlert, Clock } from "lucide-react";

interface TodoCardHeadProps {
  eyebrow: string;
  blocked: boolean;
}

// 막힌 일은 붉은 경고, 그 밖(인증 반려 포함)은 주황 시계.
export function TodoCardHead({ eyebrow, blocked }: TodoCardHeadProps) {
  const Icon = blocked ? CircleAlert : Clock;
  const foreground = blocked ? "danger" : "warning";
  return (
    <HStack align="center" gap="100">
      <Text foreground={foreground} className="flex">
        <Icon size={14} strokeWidth={2.2} aria-hidden />
      </Text>
      <Text
        typography="body4"
        weight="bold"
        foreground={foreground}
        truncate
        className="min-w-0 flex-1"
      >
        {eyebrow}
      </Text>
    </HStack>
  );
}
