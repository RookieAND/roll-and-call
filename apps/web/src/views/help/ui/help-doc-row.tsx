import { Text } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface HelpDocRowProps {
  slug: string;
  title: string;
}

export function HelpDocRow({ slug, title }: HelpDocRowProps) {
  return (
    <Link
      href={`/help/${slug}`}
      className="flex min-h-[48px] items-center gap-125 rounded-400 border border-gray-200 px-150 py-125 transition-colors hover:bg-gray-50"
    >
      <Text typography="subtitle2" className="min-w-0 flex-1">
        {title}
      </Text>
      <ChevronRight size={16} className="flex-none text-gray-400" aria-hidden />
    </Link>
  );
}
