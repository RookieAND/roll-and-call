import { Card, HStack, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface HelpRelatedRowProps {
  slug: string;
  title: string;
}

export function HelpRelatedRow({ slug, title }: HelpRelatedRowProps) {
  return (
    <Card.Root radius={400} padding="sm" interactive render={<Link href={`/help/${slug}`} />}>
      <HStack align="center" gap="125">
        <Text typography="body3" weight="bold" render={<span />} className="min-w-0 flex-1">
          {title}
        </Text>
        <ChevronRight size={16} className="flex-none text-hint" aria-hidden />
      </HStack>
    </Card.Root>
  );
}
