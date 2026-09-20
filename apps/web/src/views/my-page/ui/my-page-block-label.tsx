import { HStack, Text } from "@trpg/ui";
import Link from "next/link";

interface MyPageBlockLabelProps {
  label: string;
  action?: { href: string; label: string };
}

export function MyPageBlockLabel({ label, action }: MyPageBlockLabelProps) {
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
