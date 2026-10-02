import { IndexView, loadIndexServers } from "@/views/index";

// 인덱스와 같은 소개 페이지를 자동 이동 없이 보여 준다.
export default async function AboutPage() {
  const { servers, joinable } = await loadIndexServers();
  return <IndexView servers={servers} joinable={joinable} />;
}
