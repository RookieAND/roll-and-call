import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { REQUEST_PATH_HEADER, serverJoinPath } from "@/shared/lib";

import { getCurrentServer } from "../auth/get-current-server";
import { getCurrentMembership } from "./get-current-membership";

// 멤버 전용 화면의 문지기. 가입하지 않았으면 가입 화면으로 보내고, 가입·온보딩 뒤 지금 주소로 돌아온다.
export async function requireMembership() {
  const [server, membership] = await Promise.all([getCurrentServer(), getCurrentMembership()]);
  if (membership) return membership;
  const next = (await headers()).get(REQUEST_PATH_HEADER) ?? `/${server.slug}`;
  redirect(serverJoinPath({ slug: server.slug, next }));
}
