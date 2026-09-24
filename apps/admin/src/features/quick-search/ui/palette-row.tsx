import { HStack, Text, VStack, cn } from "@roll-and-call/ui";
import Link from "next/link";

import { IconTile, Kbd } from "@/shared/ui";

import type { PaletteItem } from "../model/palette-item";

interface PaletteRowProps {
  item: PaletteItem;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
}

export function PaletteRow({ item, active, onHover, onSelect }: PaletteRowProps) {
  return (
    <HStack
      id={`palette-${item.id}`}
      role="option"
      aria-selected={active}
      align="center"
      gap="125"
      render={<Link href={item.href} onClick={onSelect} />}
      onMouseMove={onHover}
      className={cn("rounded-400 px-125 py-100", active && "bg-tinted-bg")}
    >
      <IconTile icon={item.icon} tone={item.tone} />
      <VStack gap="025" className="min-w-0">
        <Text
          typography="body3"
          weight={active ? "bold" : "medium"}
          truncate
          className="leading-[1.3]"
        >
          {item.title}
        </Text>
        {item.meta ? (
          <Text typography="body4" foreground="hint" truncate className="leading-[1.3]">
            {item.meta}
          </Text>
        ) : null}
      </VStack>
      {item.shortcut ? (
        <HStack gap="050" className="ml-auto" aria-hidden>
          <Kbd>G</Kbd>
          <Kbd>{item.shortcut}</Kbd>
        </HStack>
      ) : null}
    </HStack>
  );
}
