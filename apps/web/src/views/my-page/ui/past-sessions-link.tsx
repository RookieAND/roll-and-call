import { Text } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

// 지난 세션이 있을 때만 보이는 하단 진입점.
export function PastSessionsLink({ count, href }: { count: number; href: string }) {
  if (count === 0) return null;

  return (
    <Link
      href={href}
      className="flex items-center justify-center gap-1 border-t border-gray-100 pt-4 text-gray-600"
    >
      <Text typography="body3" foreground="muted" className="font-semibold">
        지난 세션 {count}
      </Text>
      <ChevronRight size={15} aria-hidden />
    </Link>
  );
}
