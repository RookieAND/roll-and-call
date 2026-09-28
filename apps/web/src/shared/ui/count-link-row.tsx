import { HStack, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface CountLinkRowProps {
  label: string;
  count: number;
  href: string;
}

// 이름 · 개수 · 꺾쇠 한 줄짜리 이동 행. 테두리 상자 안에 여러 줄을 쌓는다.
export function CountLinkRow({ label, count, href }: CountLinkRowProps) {
  return (
    <HStack
      align="center"
      gap="125"
      render={<Link href={href} />}
      className="min-h-12 border-t border-gray-200 px-175 py-100 transition-colors first:border-t-0 hover:bg-gray-50"
    >
      <Text typography="body3" weight="bold" className="min-w-0 flex-1">
        {label}
      </Text>
      <Text typography="body4" foreground="hint" numeric>
        {count}
      </Text>
      <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
    </HStack>
  );
}
