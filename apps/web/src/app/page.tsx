import { redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { IndexView, loadIndexServers } from "@/views/index";

// 가입 서버가 1개면 그리기 전에 그 서버 홈으로 보낸다. 2개 이상이면 소개와 내 서버 버튼을 보인다(D279). 소개를 다시 보려면 /about.
export default async function IndexPage({ searchParams }: PageProps<"/">) {
  const [{ servers, joinable }, { auth_error: authError }] = await Promise.all([
    loadIndexServers(),
    searchParams,
  ]);
  const [only, ...rest] = servers ?? [];
  if (only && rest.length === 0) redirect(serverPath({ slug: only.slug, path: "/" }));
  return <IndexView servers={servers} joinable={joinable} authError={authError === "1"} />;
}
