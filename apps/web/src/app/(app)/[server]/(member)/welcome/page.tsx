import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { safeNextPath, serverPath } from "@/shared/lib";
import { ServerWelcomeView } from "@/views/server-welcome";

export const metadata: Metadata = { title: "가입 완료" };

export default async function Page({ params, searchParams }: PageProps<"/[server]/welcome">) {
  const [{ server }, { next }] = await Promise.all([params, searchParams]);
  const safeNext = safeNextPath({
    value: isString(next) ? next : null,
    fallback: serverPath({ slug: server, path: "/games" }),
  });
  return <ServerWelcomeView next={safeNext} />;
}
