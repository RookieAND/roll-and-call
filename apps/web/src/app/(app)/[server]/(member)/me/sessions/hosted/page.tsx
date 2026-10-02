import { redirect } from "next/navigation";

import { SESSION_ROLE } from "@/entities/game";
import { serverPath } from "@/shared/lib";
import { getCurrentServer } from "@/shared/server";
import { SESSION_CHIP } from "@/widgets/session-list";

const LEGACY_CLOSED_TAB = "closed";

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const server = await getCurrentServer();
  const base = serverPath({ slug: server.slug, path: `/me/sessions?tab=${SESSION_ROLE.host}` });
  if (tab === LEGACY_CLOSED_TAB) redirect(`${base}&status=${SESSION_CHIP.ended}`);
  if (tab === SESSION_CHIP.recruiting || tab === SESSION_CHIP.confirmed) {
    redirect(`${base}&status=${tab}`);
  }
  redirect(base);
}
