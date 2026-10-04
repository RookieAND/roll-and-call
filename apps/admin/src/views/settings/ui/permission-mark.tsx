import { Text } from "@roll-and-call/ui";
import { Check } from "lucide-react";

interface PermissionMarkProps {
  allowed: boolean;
}

export function PermissionMark({ allowed }: PermissionMarkProps) {
  return allowed ? (
    <Text typography="body3" foreground="primary" className="inline-flex">
      <Check size={16} aria-hidden />
      <span className="sr-only">가능</span>
    </Text>
  ) : (
    <span className="sr-only">불가</span>
  );
}
