import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentStaff } from "@/shared/server";
import { DeniedView } from "@/views/denied";

export const metadata: Metadata = { title: "권한 없음" };

export default async function DeniedPage() {
  const staff = await getCurrentStaff();
  if (staff.status === "anonymous") redirect("/login");
  if (staff.status === "staff") redirect("/");
  return (
    <DeniedView
      nickname={staff.nickname}
      userAppUrl={process.env.NEXT_PUBLIC_USER_APP_URL ?? "/"}
    />
  );
}
