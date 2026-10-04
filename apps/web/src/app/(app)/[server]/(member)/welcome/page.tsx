import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { serverNextPath } from "@/shared/lib";
import { requireMembership } from "@/shared/server";
import { ServerWelcomeView } from "@/views/server-welcome";

export const metadata: Metadata = { title: "가입 완료" };

export default async function Page({ params, searchParams }: PageProps<"/[server]/welcome">) {
  await requireMembership();
  const [{ server }, { next }] = await Promise.all([params, searchParams]);
  const safeNext = serverNextPath({ slug: server, value: isString(next) ? next : null });
  return <ServerWelcomeView next={safeNext} />;
}
