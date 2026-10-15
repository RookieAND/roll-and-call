"use client";

import { toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { signOut } from "../api/sign-out";

export function useSignOut() {
  const router = useRouter();
  const [busy, startSigningOut] = useTransition();

  const signOutAndLeave = () =>
    startSigningOut(async () => {
      try {
        await signOut();
      } catch {
        toast.danger("로그아웃하지 못했습니다.", { description: "다시 시도해 주세요." });
        return;
      }
      router.replace("/login?signedOut=1");
    });

  return { busy, signOutAndLeave };
}
