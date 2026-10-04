import { headers } from "next/headers";

import { SERVER_SLUG_HEADER } from "@/shared/lib";
import { getServerBySlug } from "@/shared/server";
import { DeniedOtherServerView } from "@/views/denied";

// 다른 서버의 화면·조치에 들어오면 403과 함께 「이 서버의 운영진이 아닙니다」를 보여 준다. 서버 이름은 proxy가 넘긴 slug로 찾는다.
export default async function Forbidden() {
  const slug = (await headers()).get(SERVER_SLUG_HEADER);
  const server = slug ? await getServerBySlug(slug) : undefined;
  return (
    <DeniedOtherServerView
      serverName={server?.name ?? null}
      userAppUrl={process.env.NEXT_PUBLIC_USER_APP_URL ?? "/"}
    />
  );
}
