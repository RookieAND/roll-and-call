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
      <Text typography="subtitle2" foreground="muted" render={<h2 />} className="flex-1 text-[12.5px]">
        {label}
      </Text>
      {action && (
        <Link href={action.href}>
          <Text typography="body4" foreground="primary" className="text-[12.5px] font-semibold">
            {action.label}
          </Text>
        </Link>
      )}
    </div>
  );
}
