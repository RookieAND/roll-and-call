"use client";

import { Button } from "@roll-and-call/ui";
import { Plus } from "lucide-react";

import { AddSellerDialog } from "./add-seller-dialog";

export function AddSellerButton() {
  return (
    <AddSellerDialog trigger={<Button size="sm" className="gap-050" />}>
      <Plus size={14} aria-hidden />
      판매처 추가
    </AddSellerDialog>
  );
}
