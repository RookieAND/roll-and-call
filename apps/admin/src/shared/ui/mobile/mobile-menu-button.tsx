"use client";

import { IconButton } from "@roll-and-call/ui";
import { Menu } from "lucide-react";
import { useContext } from "react";

import { MobileDrawerContext } from "./mobile-drawer-context";

export function MobileMenuButton() {
  const { openDrawer } = useContext(MobileDrawerContext);
  return (
    <IconButton aria-label="메뉴 열기" onClick={openDrawer} className="size-11 text-gray-900">
      <Menu size={22} aria-hidden />
    </IconButton>
  );
}
