"use client";

import { Button } from "@roll-and-call/ui";

import { AddSellerDialog } from "./add-seller-dialog";

// 모바일 화면 아래 고정 바의 추가 버튼. 아이콘은 넣지 않는다.
export function MobileAddSellerButton() {
  return (
    <AddSellerDialog trigger={<Button size="lg" className="w-full" />}>판매처 추가</AddSellerDialog>
  );
}
