import { getCurrentServer } from "@/shared/server";

// 주소의 slug로 서버를 찾는다. 없는 서버면 getCurrentServer가 404로 보낸다.
export default async function ServerLayout({ children }: LayoutProps<"/[server]">) {
  await getCurrentServer();
  return children;
}
