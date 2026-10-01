import "server-only";
import { getServerBySlug } from "@roll-and-call/database/servers";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";

import { SERVER_SLUG_HEADER } from "@/shared/lib";

// 페이지·서버 액션·API가 같은 요청에서 여러 번 불러도 servers는 한 번만 읽는다.
// slug는 proxy가 주소에서 읽어 헤더로 넘긴다. 없는 서버면 404다.
export const getCurrentServer = cache(async () => {
  const slug = (await headers()).get(SERVER_SLUG_HEADER);
  const server = slug ? await getServerBySlug(slug) : undefined;
  if (!server) notFound();
  return server;
});
