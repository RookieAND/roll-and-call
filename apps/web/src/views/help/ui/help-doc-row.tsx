import { Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface HelpDocRowProps {
  slug: string;
  title: string;
}

// 목록 행. 카드 한 장 안에서 구분선으로 나뉜다.
export function HelpDocRow({ slug, title }: HelpDocRowProps) {
  return (
    <Link
      href={`/help/${slug}`}
      className="flex items-center gap-150 border-gray-100 px-175 py-175 transition-colors not-first:border-t hover:bg-gray-50"
    >
      <Text typography="subtitle1" className="min-w-0 flex-1">
        {title}
      </Text>
      <ChevronRight size={17} className="flex-none text-gray-400" aria-hidden />
    </Link>
  );
}
