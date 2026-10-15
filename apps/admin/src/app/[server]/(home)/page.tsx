import type { Metadata } from "next";

import { getWeeklySummary } from "@/entities/analytics/server";
import { stringParams } from "@/shared/lib";
import { getCurrentServer, getCurrentStaff, getPendingItems } from "@/shared/server";
import { HomeMobileView, HomeView } from "@/views/home";

export const metadata: Metadata = { title: "홈" };

export default async function HomePage({ searchParams }: PageProps<"/[server]">) {
  const { empty } = stringParams(await searchParams);
  const [weekly, pendingItems, server, staff] = await Promise.all([
    getWeeklySummary(),
    getPendingItems(),
    getCurrentServer(),
    getCurrentStaff(),
  ]);
  // ?empty=1은 개발 중에 home_empty 상태를 미리 보는 용도다.
  const previewEmpty = process.env.NODE_ENV !== "production" && empty === "1";
  const props = {
    weekly,
    pendingItems: previewEmpty ? [] : pendingItems,
    staffChannel: Boolean(server.staffChannelId),
    owner: staff.status === "staff" && staff.role === "owner",
  };
  return (
    <>
      <div className="contents max-lg:hidden">
        <HomeView {...props} />
      </div>
      <div className="contents lg:hidden">
        <HomeMobileView today={new Date()} {...props} />
      </div>
    </>
  );
}
