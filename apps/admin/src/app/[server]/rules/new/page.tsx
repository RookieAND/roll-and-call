import { isString } from "es-toolkit";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import {
  getCurrentServer,
  listRulebookRequests,
  listRulebooks,
  requireStaff,
} from "@/shared/server";
import { RulebookNewView } from "@/views/rulebook-new";

export const metadata: Metadata = { title: "룰북 추가" };

export default async function RulebookNewPage({ searchParams }: PageProps<"/[server]/rules/new">) {
  const [{ request: requestId, category }, staff, server] = await Promise.all([
    searchParams,
    requireStaff(),
    getCurrentServer(),
  ]);
  const [{ rows }, requests] = await Promise.all([listRulebooks(), listRulebookRequests()]);
  const request = isString(requestId)
    ? (requests.find((candidate) => candidate.id === requestId) ?? null)
    : null;
  // 그사이 처리된 요청이면 요청 목록으로 돌아간다.
  if (isString(requestId) && !request) {
    redirect(serverPath({ slug: server.slug, path: "/rules?tab=requests" }));
  }
  return (
    <RulebookNewView
      rulebooks={rows}
      request={request}
      initialCategory={isString(category) ? category : undefined}
      viewerId={staff.id}
    />
  );
}
