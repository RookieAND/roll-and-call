import { Button, Text, VStack } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { IconTile } from "@/shared/ui";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  highlighted?: boolean;
}

// 조치 영역의 한 줄. 누르면 주소의 action으로 확인 창이 열린다.
export function ActionCard({ icon, title, description, href, highlighted }: ActionCardProps) {
  const variant = highlighted ? "tinted" : "outline";
  const tone = highlighted ? "primary" : "gray";
  const titleForeground = highlighted ? "primary" : "normal";
  const foreground = highlighted ? "primary" : "hint";
  return (
    <Button
      variant={variant}
      colorPalette={tone}
      render={<Link href={href} scroll={false} />}
      className="h-auto w-full items-start justify-start gap-125 rounded-400 px-150 py-125 text-left whitespace-normal"
    >
      <IconTile icon={icon} tone={tone} size="sm" />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body3" weight="bold" foreground={titleForeground}>
          {title}
        </Text>
        <Text typography="body4" weight="regular" foreground={foreground}>
          {description}
        </Text>
      </VStack>
    </Button>
  );
}
