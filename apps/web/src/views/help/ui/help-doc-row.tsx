import { HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface HelpDocRowProps {
  href: string;
  title: string;
  description?: ReactNode;
}

export function HelpDocRow({ href, title, description }: HelpDocRowProps) {
  return (
    <HStack
      align="center"
      gap="150"
      render={<Link href={href} />}
      className="min-h-[52px] border-gray-200 px-175 transition-colors not-first:border-t hover:bg-gray-50"
    >
      <VStack gap="025" className="min-w-0 flex-1 py-150">
        <Text typography="subtitle1" weight="bold" render={<span />}>
          {title}
        </Text>
        {description && (
          <Text typography="body4" foreground="muted" render={<span />} className="text-pretty">
            {description}
          </Text>
        )}
      </VStack>
      <ChevronRight size={17} className="flex-none text-hint" aria-hidden />
    </HStack>
  );
}
