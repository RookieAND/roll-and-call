import { markOnboarded } from "@roll-and-call/database/profiles";
import { isString } from "es-toolkit";
import type { Metadata } from "next";
import { after } from "next/server";

import { safeNextPath } from "@/shared/lib";
import { getCurrentUser } from "@/shared/server";
import { OnboardingView } from "@/views/onboarding";

export const metadata: Metadata = { title: "둘러보기" };

const FROM_HELP = "help";

export default async function Page({ searchParams }: PageProps<"/onboarding">) {
  const [{ next, from }, user] = await Promise.all([searchParams, getCurrentUser()]);
  // 건너뛰기든 끝까지 보든 두 번 뜨지 않게, 들어온 순간 본 것으로 친다. 실패하면 다음에 한 번 더 뜰 뿐이라 알리지 않는다.
  if (user) after(() => markOnboarded(user.id).catch(console.error));
  if (from === FROM_HELP) return <OnboardingView doneHref="/help" fromHelp />;
  // next가 없으면 "/"로 보내고, proxy가 기본 서버로 옮긴다.
  const doneHref = safeNextPath({ value: isString(next) ? next : null, fallback: "/" });
  return <OnboardingView doneHref={doneHref} fromHelp={false} />;
}
