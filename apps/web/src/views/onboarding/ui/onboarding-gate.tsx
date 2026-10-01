"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { onboardingSeen } from "../model/onboarding-seen";

export function OnboardingGate() {
  const router = useRouter();

  useEffect(() => {
    if (onboardingSeen()) return;
    router.replace("/onboarding");
  }, [router]);

  return null;
}
