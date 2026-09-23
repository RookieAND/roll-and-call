import { HStack, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface HelpDocRowProps {
  slug: string;
  title: string;
}

export function HelpDocRow({ slug, title }: HelpDocRowProps) {
  return (
    <HStack
      align="center"
      gap="150"
      render={<Link href={`/help/${slug}`} />}
      className="min-h-[52px] border-gray-200 px-175 transition-colors not-first:border-t hover:bg-gray-50"
    >
      <Text typography="subtitle1" weight="bold" render={<span />} className="min-w-0 flex-1">
        {title}
      </Text>
      <ChevronRight size={17} className="flex-none text-hint" aria-hidden />
    </HStack>
  );
}
