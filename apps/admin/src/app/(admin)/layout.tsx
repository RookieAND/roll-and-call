import { HStack, VStack } from "@roll-and-call/ui";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { QuickSearchPalette } from "@/features/quick-search";
import { getCurrentStaff, getPendingItems, type PendingKind } from "@/shared/server";
import { Sidebar } from "@/shared/ui";
import { PhoneNotice } from "@/views/phone";

export default async function AdminLayout({ children }: LayoutProps<"/">) {
  const staff = await getCurrentStaff();
  if (staff.status === "anonymous") redirect("/login");
  if (staff.status === "denied") redirect("/denied");

  // 처리 대기는 기다리지 않고 넘긴다. 받는 곳마다 따로 기다려서 화면 틀과 loading.tsx가 먼저 뜬다.
  const pendingItemsPromise = getPendingItems();
  const countOf = (kind: PendingKind) =>
    pendingItemsPromise.then((items) => items.find((item) => item.kind === kind)?.count);

  return (
    <>
      <div className="md:hidden">
        <Suspense>
          <PhoneNotice pendingItemsPromise={pendingItemsPromise} />
        </Suspense>
      </div>
      <HStack align="start" className="hidden min-h-dvh min-w-[1280px] md:flex">
        <Sidebar
          nickname={staff.nickname}
          role={staff.role}
          countPromises={{
            cert: countOf("cert"),
            rules: countOf("rulebookRequest"),
            posts: countOf("report"),
          }}
        />
        <VStack data-slot="admin-main" className="min-h-dvh min-w-0 flex-1 bg-gray-50">
          {children}
        </VStack>
        <Suspense>
          <QuickSearchPalette pendingItemsPromise={pendingItemsPromise} />
        </Suspense>
      </HStack>
    </>
  );
}
