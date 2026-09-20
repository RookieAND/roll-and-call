import type { Metadata } from "next";

import { OnboardingView } from "@/views/onboarding";

export const metadata: Metadata = { title: "둘러보기" };

export default function Page() {
  return <OnboardingView />;
}
