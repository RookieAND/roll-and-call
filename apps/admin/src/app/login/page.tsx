import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionAccount } from "@/shared/server";
import { LoginMobileView, LoginView } from "@/views/login";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getSessionAccount()) redirect("/");
  const { error, signedOut } = await searchParams;
  // 로그아웃 토스트는 데스크톱 View가 한 번만 띄운다. 숨긴 쪽도 마운트되므로 모바일 View에는 두지 않는다.
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <LoginView failed={Boolean(error)} signedOut={Boolean(signedOut)} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <LoginMobileView failed={Boolean(error)} />
      </div>
    </>
  );
}
