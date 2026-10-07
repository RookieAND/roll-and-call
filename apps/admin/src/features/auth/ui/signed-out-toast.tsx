"use client";

import { toast } from "@roll-and-call/ui";
import { useEffect } from "react";

export function SignedOutToast() {
  useEffect(() => {
    toast.success("로그아웃되었습니다.");
  }, []);
  return null;
}
