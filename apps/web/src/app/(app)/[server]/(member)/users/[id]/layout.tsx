import { notFound } from "next/navigation";

import { isUuid } from "@/shared/lib";

// 사용자 id 칸은 uuid라, 모양이 틀린 주소를 그대로 쿼리에 넘기면 404가 아니라 캐스팅 오류(500)가 난다.
export default async function UserLayout({
  children,
  params,
}: LayoutProps<"/[server]/users/[id]">) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  return children;
}
