"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import type { PendingItem } from "@/shared/server";
import { OPEN_PALETTE_EVENT, useServerPath } from "@/shared/ui";

import { shortcutHrefs } from "./shortcut-hrefs";

const SEQUENCE_WINDOW = 1000;

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export function usePaletteShortcuts({
  open,
  pendingItems,
}: {
  open: () => void;
  pendingItems: PendingItem[];
}) {
  const router = useRouter();
  const toServerPath = useServerPath();

  useEffect(() => {
    let pressedGAt = 0;
    const hrefs = shortcutHrefs(pendingItems);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      const key = event.key.toUpperCase();
      if (key === "G") {
        pressedGAt = Date.now();
        return;
      }
      if (Date.now() - pressedGAt > SEQUENCE_WINDOW) return;
      const href = hrefs[key];
      if (href) router.push(toServerPath(href));
      pressedGAt = 0;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, open);
    };
  }, [open, pendingItems, router, toServerPath]);
}
