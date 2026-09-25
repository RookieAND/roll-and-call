import { Button, Text, VStack } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";
import type { ReactElement } from "react";

import { IconTile } from "./icon-tile";

const TONE = {
  gray: { variant: "outline", palette: "gray", tile: "gray", title: "normal", description: "hint" },
  danger: {
    variant: "outline",
    palette: "gray",
    tile: "danger",
    title: "danger",
    description: "hint",
  },
  primary: {
    variant: "tinted",
    palette: "primary",
    tile: "primary",
    title: "primary",
    description: "primary",
  },
} as const;

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: ReactElement<Record<string, unknown>>;
  tone?: keyof typeof TONE;
}

// 오른쪽 조치 영역의 한 줄. 누르면 확인 창이나 조치 페이지로 간다.
export function ActionCard({ icon, title, description, link, tone = "gray" }: ActionCardProps) {
  const style = TONE[tone];
  return (
    <Button
      variant={style.variant}
      colorPalette={style.palette}
      render={link}
      className="h-auto w-full items-start justify-start gap-125 rounded-400 px-150 py-125 text-left whitespace-normal"
    >
      <IconTile icon={icon} tone={style.tile} size="sm" />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body3" weight="bold" foreground={style.title}>
          {title}
        </Text>
        <Text typography="body4" weight="regular" foreground={style.description}>
          {description}
        </Text>
      </VStack>
    </Button>
  );
}
