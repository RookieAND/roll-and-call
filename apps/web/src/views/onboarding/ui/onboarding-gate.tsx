"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useServerPath } from "@/shared/lib";

import { onboardingSeen } from "../model/onboarding-seen";

export function OnboardingGate() {
  const router = useRouter();
  const toServerPath = useServerPath();
  const done = toServerPath("/games");

  useEffect(() => {
    if (onboardingSeen()) return;
    router.replace(`/onboarding?next=${encodeURIComponent(done)}`);
  }, [router, done]);

  return null;
}
