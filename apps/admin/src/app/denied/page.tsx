import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionAccount, listMyServers } from "@/shared/server";
import { DeniedMobileView, DeniedView } from "@/views/denied";

export const metadata: Metadata = { title: "권한 없음" };

export default async function DeniedPage() {
  const account = await getSessionAccount();
  if (!account) redirect("/login");
  if ((await listMyServers()).length > 0) redirect("/");
  const userAppUrl = process.env.NEXT_PUBLIC_USER_APP_URL ?? "/";
  return (
    <>
      <div className="contents max-lg:hidden">
        <DeniedView nickname={account.nickname} userAppUrl={userAppUrl} />
      </div>
      <div className="contents lg:hidden">
        <DeniedMobileView nickname={account.nickname} userAppUrl={userAppUrl} />
      </div>
    </>
  );
}
