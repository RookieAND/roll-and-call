"use client";

import { cn, Sheet } from "@roll-and-call/ui";
import { LogOut } from "lucide-react";

import { MenuItemBody } from "./menu-item-body";
import { MENU_ITEM_CLASS } from "./menu-item-class";

interface MarkAbsentMemberItemProps {
  onSelect: () => void;
}

export function MarkAbsentMemberItem({ onSelect }: MarkAbsentMemberItemProps) {
  return (
    <Sheet.Item onClick={onSelect} className={cn(MENU_ITEM_CLASS, "text-danger-600")}>
      <LogOut size={18} aria-hidden className="shrink-0" />
      <MenuItemBody label="불참으로 내보내기" />
    </Sheet.Item>
  );
}
