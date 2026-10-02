"use client";

import { Button, HStack, Text } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import { Kbd } from "./kbd";
import { openPalette } from "./open-palette";

export function SidebarLauncher() {
  return (
    <Button
      variant="outline"
      colorPalette="gray"
      size="sm"
      onClick={openPalette}
      className="w-full justify-start gap-100 rounded-full bg-gray-50 px-125 font-normal"
    >
      <Search size={14} aria-hidden className="text-hint" />
      <Text typography="body4" foreground="hint" truncate className="min-w-0">
        검색 · 이동
      </Text>
      <HStack gap="050" className="ml-auto" aria-hidden>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </HStack>
    </Button>
  );
}
