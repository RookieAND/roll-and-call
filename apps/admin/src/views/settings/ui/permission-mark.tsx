import { Text } from "@roll-and-call/ui";

interface PermissionMarkProps {
  allowed: boolean;
}

export function PermissionMark({ allowed }: PermissionMarkProps) {
  return allowed ? (
    <Text typography="body3" weight="bold" foreground="inherit" className="text-tinted-ink">
      ○<span className="sr-only">가능</span>
    </Text>
  ) : (
    <Text typography="body3" weight="bold" foreground="hint">
      —<span className="sr-only">불가</span>
    </Text>
  );
}
