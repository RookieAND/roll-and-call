import { Text, cn } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface MySessionRowProps {
  label: string;
  count: number;
  detail: string | null;
  urgent?: boolean;
  href: string;
}

export function MySessionRow({ label, count, detail, urgent = false, href }: MySessionRowProps) {
  const detailClass = cn("mt-025 block", urgent && "text-warning-600");
  const detailForeground = urgent ? undefined : "muted";
  // 0도 정보라 행은 남기되, 숫자는 한 단계 내려 "없음"으로 읽히게 한다.
  const countForeground = count === 0 ? "hint" : "normal";

  return (
    <Link
      href={href}
      className="flex min-h-14 items-center gap-150 border-gray-100 px-175 py-125 transition-colors not-first:border-t hover:bg-gray-50"
    >
      <div className="min-w-0 flex-1">
        <Text typography="subtitle1" className="block">
          {label}
        </Text>
        {detail && (
          <Text typography="body4" foreground={detailForeground} className={detailClass}>
            {detail}
          </Text>
        )}
      </div>
      <Text
        numeric
        weight="extrabold"
        typography="heading3"
        foreground={countForeground}
        className="flex-none"
      >
        {count}
      </Text>
      <ChevronRight size={17} className="flex-none text-gray-400" aria-hidden />
    </Link>
  );
}
