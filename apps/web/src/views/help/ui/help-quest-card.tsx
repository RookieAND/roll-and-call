import { Card, HStack, Text } from "@roll-and-call/ui";
import { ChevronRight, PlayCircle } from "lucide-react";
import Link from "next/link";

interface HelpQuestCardProps {
  href: string;
  progress: string | null;
}

export function HelpQuestCard({ href, progress }: HelpQuestCardProps) {
  return (
    <Card.Root
      padding="sm"
      interactive
      render={<Link href={href} />}
      className="border-tinted-border bg-tinted-bg hover:bg-tinted-bg-hover"
    >
      <HStack align="center" gap="150" className="px-050 py-025">
        <span className="flex size-9.5 flex-none items-center justify-center rounded-500 bg-primary-600 text-white">
          <PlayCircle size={19} aria-hidden />
        </span>
        <Text
          typography="subtitle1"
          weight="extrabold"
          render={<span />}
          className="min-w-0 flex-1"
        >
          튜토리얼 퀘스트
        </Text>
        {progress && (
          <Text typography="body3" foreground="muted" numeric render={<span />}>
            {progress}
          </Text>
        )}
        <ChevronRight size={18} className="flex-none text-hint" aria-hidden />
      </HStack>
    </Card.Root>
  );
}
