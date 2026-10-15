"use client";

import { Button } from "@roll-and-call/ui";

import { useSignOut } from "../model/use-sign-out";

// 모바일 드로어에는 마우스를 올리는 동작이 없어 내 정보 줄에 글자 버튼을 늘 보인다.
export function SignOutMobileButton() {
  const { busy, signOutAndLeave } = useSignOut();

  return (
    <Button
      variant="outline"
      colorPalette="gray"
      disabled={busy}
      onClick={signOutAndLeave}
      className="h-11 shrink-0"
    >
      {busy ? "로그아웃 중" : "로그아웃"}
    </Button>
  );
}
