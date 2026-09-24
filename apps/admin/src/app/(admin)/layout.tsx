import { HStack, VStack } from "@roll-and-call/ui";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { QuickSearchPalette } from "@/features/quick-search";
import { getCurrentStaff, getPendingItems, getServerName } from "@/shared/server";
import { Sidebar } from "@/shared/ui";
import { PhoneNotice } from "@/views/phone";

export default async function AdminLayout({ children }: LayoutProps<"/">) {
  const staff = await getCurrentStaff();
  if (staff.status === "anonymous") redirect("/login");
  if (staff.status === "denied") redirect("/denied");

  const [pendingItems, serverName] = await Promise.all([getPendingItems(), getServerName()]);
  const countOf = (kind: (typeof pendingItems)[number]["kind"]) =>
    pendingItems.find((item) => item.kind === kind)?.count;

  return (
    <>
      <div className="md:hidden">
        <PhoneNotice pendingItems={pendingItems} />
      </div>
      <HStack align="start" className="hidden min-h-dvh min-w-[1280px] md:flex">
        <Sidebar
          nickname={staff.nickname}
          role={staff.role}
          serverName={serverName}
          counts={{
            cert: countOf("cert"),
            rules: countOf("rulebookRequest"),
            posts: countOf("report"),
          }}
        />
        <VStack className="min-h-dvh min-w-0 flex-1 bg-gray-50">{children}</VStack>
        <Suspense>
          <QuickSearchPalette pendingItems={pendingItems} />
        </Suspense>
      </HStack>
    </>
  );
}
