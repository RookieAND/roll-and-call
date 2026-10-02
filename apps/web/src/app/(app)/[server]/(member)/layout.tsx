import { requireMembership } from "@/shared/server";

// 이 그룹은 가입한 사람만 본다. 구인 목록·상세는 (public)에 있어 비멤버도 읽는다.
export default async function MemberLayout({ children }: LayoutProps<"/[server]">) {
  await requireMembership();
  return children;
}
