"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PENDING_COPY } from "@/shared/lib";
import { OPEN_PALETTE_EVENT } from "@/shared/ui";

const SEQUENCE_WINDOW = 1000;

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

// ⌘K·Ctrl+K로 팔레트를 열고, 입력 중이 아닐 때 G 다음 C·B·P로 처리 대기 화면에 간다.
export function usePaletteShortcuts(open: () => void) {
  const router = useRouter();

  useEffect(() => {
    let pressedGAt = 0;
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
      const target = Object.values(PENDING_COPY).find((copy) => copy.shortcut === key);
      if (target) router.push(target.href);
      pressedGAt = 0;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, open);
    };
  }, [open, router]);
}
