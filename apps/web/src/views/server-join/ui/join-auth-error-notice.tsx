"use client";

import { useEffect } from "react";

import { toast } from "@/shared/ui";

const MESSAGE = "디스코드 로그인을 마치지 못했습니다. 다시 시도해 주세요.";

export function JoinAuthErrorNotice() {
  // toast id가 문구라 StrictMode에서 두 번 불려도 한 번만 보인다.
  useEffect(() => {
    toast.error(MESSAGE);
  }, []);
  return null;
}
