import { IndexView, loadIndexServers } from "@/views/index";

// 인덱스와 같은 소개 페이지를 자동 이동 없이 보여 준다.
export default async function AboutPage({ searchParams }: PageProps<"/about">) {
  const [{ servers, joinable }, { auth_error: authError }] = await Promise.all([
    loadIndexServers(),
    searchParams,
  ]);
  return <IndexView servers={servers} joinable={joinable} authError={authError === "1"} />;
}
