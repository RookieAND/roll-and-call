import { HStack, Text } from "@trpg/ui";
import { CircleAlert } from "lucide-react";

interface UrgentSessionEyebrowProps {
  label: string;
}

// 기한이 지난 건 남은 할 일 중에서도 색이 달라야 한다. 나머지와 같은 주황이면 묻힌다.
export function UrgentSessionEyebrow({ label }: UrgentSessionEyebrowProps) {
  return (
    <HStack align="center" gap="100" className="mb-100 text-danger-600">
      <CircleAlert size={14} strokeWidth={2.2} aria-hidden className="shrink-0" />
      <Text weight="bold" typography="body4" foreground="inherit">
        {label}
      </Text>
    </HStack>
  );
}
