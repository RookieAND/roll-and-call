import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { MyRulebooksView } from "@/views/my-rulebooks";

export const metadata: Metadata = { title: "내 룰북" };
export default async function Page() {
  await requireMembership();
  return <MyRulebooksView />;
}
