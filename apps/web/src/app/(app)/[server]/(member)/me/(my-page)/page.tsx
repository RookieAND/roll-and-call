import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { MyPageView } from "@/views/my-page";

export const metadata: Metadata = { title: "마이페이지" };
export default async function Page() {
  await requireMembership();
  return <MyPageView />;
}
