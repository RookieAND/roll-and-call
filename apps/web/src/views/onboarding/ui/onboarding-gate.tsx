"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { onboardingSeen } from "../model/onboarding-seen";

// 로그인한 사람이 홈에 처음 닿을 때 한 번만 소개를 흘린다.
export function OnboardingGate() {
  const router = useRouter();

  useEffect(() => {
    if (onboardingSeen()) return;
    router.replace("/onboarding");
  }, [router]);

  return null;
}
