import { redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { getCurrentServer } from "@/shared/server";
import { SESSION_CHIP } from "@/widgets/session-list";

const LEGACY_CLOSED_TAB = "closed";

// 예전 주소: 내 세션 한 화면으로 합쳐졌으니 옛 탭 값을 새 탭·칩으로 옮겨 보낸다.
export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const sessionsPath = serverPath({ slug: (await getCurrentServer()).slug, path: "/me/sessions" });
  if (tab === LEGACY_CLOSED_TAB) redirect(`${sessionsPath}?status=${SESSION_CHIP.ended}`);
  if (tab === SESSION_CHIP.confirmed || tab === SESSION_CHIP.waiting) {
    redirect(`${sessionsPath}?status=${tab}`);
  }
  redirect(sessionsPath);
}
