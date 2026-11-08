import { Button, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface MyPageReviewRowProps {
  label: string;
  count: number;
  href: string;
}

export function MyPageReviewRow({ label, count, href }: MyPageReviewRowProps) {
  return (
    <Button
      render={<Link href={href} />}
      variant="ghost"
      colorPalette="gray"
      className="h-auto min-h-12 w-full justify-start gap-125 rounded-none px-125 py-100 text-left not-first:border-t not-first:border-gray-200"
    >
      <Text typography="subtitle2" className="min-w-0 flex-1">
        {label}
      </Text>
      <Text typography="body4" foreground="hint" className="tabular-nums">
        {count}
      </Text>
      <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
    </Button>
  );
}
