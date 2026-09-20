import { Text } from "@trpg/ui";
import Link from "next/link";

export function MyPageBlockLabel({
  label,
  action,
}: {
  label: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-2 flex items-center">
      <Text typography="subtitle3" foreground="muted" render={<h2 />} className="flex-1">
        {label}
      </Text>
      {action && (
        <Link href={action.href}>
          <Text weight="medium" typography="body4" foreground="primary">
            {action.label}
          </Text>
        </Link>
      )}
    </div>
  );
}
