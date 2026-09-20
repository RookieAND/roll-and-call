import { Text } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function HelpDocRow({ slug, title }: { slug: string; title: string }) {
  return (
    <Link
      href={`/help/${slug}`}
      className="flex min-h-[52px] items-center gap-3 border-gray-100 px-3.5 py-2.5 transition-colors not-first:border-t hover:bg-gray-50"
    >
      <Text typography="subtitle1" className="min-w-0 flex-1">
        {title}
      </Text>
      <ChevronRight size={17} className="flex-none text-gray-400" aria-hidden />
    </Link>
  );
}
