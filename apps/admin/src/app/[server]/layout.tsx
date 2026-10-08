import { getActiveMembership } from "@roll-and-call/database/servers";
import { HStack, VStack } from "@roll-and-call/ui";
import { forbidden, redirect } from "next/navigation";
import { Suspense } from "react";

import { SignOutIconButton } from "@/features/auth";
import { QuickSearchPalette } from "@/features/quick-search";
import {
  getCurrentServer,
  getCurrentStaff,
  getPendingItems,
  listMyServers,
  type PendingKind,
} from "@/shared/server";
import { BotBanner, CurrentServerProvider, Sidebar } from "@/shared/ui";
import { PhoneNotice } from "@/views/phone";

export default async function AdminLayout({ children }: LayoutProps<"/[server]">) {
  const staff = await getCurrentStaff();
  if (staff.status === "anonymous") redirect("/login");
  if (staff.status === "denied") {
    // 다른 서버의 운영진이 주소를 바꿔 들어오면 403, 어디에도 권한이 없으면 권한 없음 화면으로 보낸다.
    if ((await listMyServers()).length > 0) forbidden();
    redirect("/denied");
  }
  const [server, servers] = await Promise.all([getCurrentServer(), listMyServers()]);
  // 유저 앱에 가입하지 않은 운영진은 가입 화면으로 보낸다. 플랫폼 관리자는 가입 없이 모든 서버를 본다.
  if (
    !staff.platformAdmin &&
    !(await getActiveMembership({ serverId: server.id, userId: staff.id }))
  ) {
    const userAppUrl = process.env.NEXT_PUBLIC_USER_APP_URL ?? "";
    const adminHome = `${process.env.ADMIN_APP_URL?.replace(/\/$/, "")}/${server.slug}`;
    redirect(`${userAppUrl}/${server.slug}/join?next=${encodeURIComponent(adminHome)}`);
  }
  const current = servers.find((candidate) => candidate.slug === server.slug) ?? {
    ...server,
    role: staff.role,
    pending: 0,
  };

  // 처리 대기는 기다리지 않고 넘긴다. 받는 곳마다 따로 기다려서 화면 틀과 loading.tsx가 먼저 뜬다.
  const pendingItemsPromise = getPendingItems();
  const countOf = (kind: PendingKind) =>
    pendingItemsPromise.then((items) => items.find((item) => item.kind === kind)?.count);

  return (
    <CurrentServerProvider server={{ slug: server.slug, name: server.name, icon: server.icon }}>
      <div className="md:hidden">
        <Suspense>
          <PhoneNotice pendingItemsPromise={pendingItemsPromise} />
        </Suspense>
      </div>
      <HStack align="start" className="hidden min-h-dvh min-w-[1280px] md:flex">
        <Sidebar
          nickname={staff.nickname}
          role={staff.role}
          platformAdmin={staff.platformAdmin}
          server={current}
          servers={servers}
          countPromises={{ cert: countOf("cert"), rules: countOf("rulebookRequest") }}
          signOutButton={<SignOutIconButton />}
        />
        <VStack
          data-slot="admin-main"
          className="min-h-dvh min-w-0 flex-1 overflow-x-clip bg-gray-50"
        >
          {server.botConnected ? null : <BotBanner />}
          {children}
        </VStack>
        <Suspense>
          <QuickSearchPalette
            pendingItemsPromise={pendingItemsPromise}
            owner={staff.role === "owner"}
          />
        </Suspense>
      </HStack>
    </CurrentServerProvider>
  );
}
