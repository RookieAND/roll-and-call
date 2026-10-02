import { Suspense } from "react";

import { getCurrentSessionUser } from "@/shared/server";
import { HomeSkeleton, HomeView } from "@/views/home";
import { OnboardingGate } from "@/views/onboarding";

// 쿼리만 바뀌는 이동은 loading.tsx가 다시 뜨지 않으므로, 달을 key로 경계를 새로 만든다. 같은 달 안의 날짜 선택은 pushState라 서버를 거치지 않는다.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ auth_error?: string; date?: string }>;
}) {
  const { auth_error: authError, date } = await searchParams;
  const user = await getCurrentSessionUser();

  return (
    <>
      {user && <OnboardingGate />}
      <Suspense key={date?.slice(0, 7)} fallback={<HomeSkeleton date={date} />}>
        <HomeView date={date} authError={authError === "1"} />
      </Suspense>
    </>
  );
}
