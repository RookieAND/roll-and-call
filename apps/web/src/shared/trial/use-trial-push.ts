"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

import { TrialContext } from "./trial-context";

// router.push 자리. 체험 안이면 체험 화면 이동으로, 아니면 실제 이동이다.
export function useTrialPush(): (href: string) => void {
  const router = useRouter();
  const runtime = use(TrialContext);
  return runtime ? runtime.navigate : (href) => router.push(href);
}
