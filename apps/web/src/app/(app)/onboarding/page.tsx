import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { safeNextPath } from "@/shared/lib";
import { OnboardingView } from "@/views/onboarding";

export const metadata: Metadata = { title: "둘러보기" };

export default async function Page({ searchParams }: PageProps<"/onboarding">) {
  const { next } = await searchParams;
  // next가 없으면 "/"로 보내고, proxy가 기본 서버로 옮긴다.
  const doneHref = safeNextPath({ value: isString(next) ? next : null, fallback: "/" });
  return <OnboardingView doneHref={doneHref} />;
}
