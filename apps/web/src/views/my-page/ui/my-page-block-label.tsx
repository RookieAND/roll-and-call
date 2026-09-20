import { HStack, Text } from "@trpg/ui";
import Link from "next/link";

export function MyPageBlockLabel({
  label,
  action,
}: {
  label: string;
  action?: { href: string; label: string };
}) {
  return (
    <HStack align="center" className="mb-100">
      <Text weight="bold" typography="body4" foreground="muted" render={<h2 />} className="flex-1">
        {label}
      </Text>
      {action && (
        <Link href={action.href}>
          <Text weight="medium" typography="body4" foreground="primary">
            {action.label}
          </Text>
        </Link>
      )}
    </HStack>
  );
}
