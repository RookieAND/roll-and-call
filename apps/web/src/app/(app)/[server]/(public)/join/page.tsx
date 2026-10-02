import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { serverNextPath } from "@/shared/lib";
import { ServerJoinView } from "@/views/server-join";

export const metadata: Metadata = { title: "서버 가입" };

export default async function Page({ params, searchParams }: PageProps<"/[server]/join">) {
  const [{ server }, { next }] = await Promise.all([params, searchParams]);
  const safeNext = serverNextPath({ slug: server, value: isString(next) ? next : null });
  return <ServerJoinView next={safeNext} />;
}
