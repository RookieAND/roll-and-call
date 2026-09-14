import { Text, cn } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

// 내 세션 한 행: 라벨 + 상태 내역 · 숫자 · 목록 진입.
export function MySessionRow({
  label,
  count,
  detail,
  urgent = false,
  href,
}: {
  label: string;
  count: number;
  detail: string | null;
  urgent?: boolean;
  href: string;
}) {
  const detailClass = cn("mt-0.5 block", urgent && "text-warning-600");
  const detailForeground = urgent ? undefined : "muted";

  return (
    <Link
      href={href}
      className="flex min-h-14 items-center gap-3 border-gray-100 px-[13px] py-2.5 transition-colors not-first:border-t hover:bg-gray-50"
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
      <Text typography="heading3" className="flex-none text-[17px] font-extrabold tabular-nums">
        {count}
      </Text>
      <ChevronRight size={17} className="flex-none text-gray-400" aria-hidden />
    </Link>
  );
}
