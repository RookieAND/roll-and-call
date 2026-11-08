import { Button, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProfileReviewRowProps {
  label: string;
  count: number;
  href: string;
}

export function ProfileReviewRow({ label, count, href }: ProfileReviewRowProps) {
  return (
    <Button
      variant="ghost"
      colorPalette="gray"
      render={<Link href={href} />}
      className="h-auto min-h-12 w-full justify-start gap-125 rounded-none border-t border-gray-200 px-125 py-100 first:border-t-0"
    >
      <Text typography="subtitle2" className="min-w-0 flex-1 text-left">
        {label}
      </Text>
      <Text typography="body4" foreground="hint" numeric>
        {count}
      </Text>
      <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
    </Button>
  );
}
