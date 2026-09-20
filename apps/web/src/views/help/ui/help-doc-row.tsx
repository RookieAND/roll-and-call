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
      className="flex min-h-[52px] items-center gap-150 border-gray-100 px-175 py-125 transition-colors not-first:border-t hover:bg-gray-50"
    >
      <Text typography="subtitle1" className="min-w-0 flex-1">
        {title}
      </Text>
      <ChevronRight size={17} className="flex-none text-gray-400" aria-hidden />
    </Link>
  );
}
