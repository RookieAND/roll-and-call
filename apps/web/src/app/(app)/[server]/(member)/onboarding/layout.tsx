import type { ReactNode } from "react";

import { TrialStoreProvider } from "@/views/trial-quest";

// 체험 저장소는 이 경로 안에서만 산다. 퀘스트를 오가도 유지되고 새로고침하면 비워진다.
export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <TrialStoreProvider>{children}</TrialStoreProvider>;
}
