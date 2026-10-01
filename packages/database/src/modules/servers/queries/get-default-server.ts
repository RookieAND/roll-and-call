import { getServerBySlug } from "./get-server-by-slug";

// 라우트가 서버를 정하지 않는 곳(/, 옛 주소, 어드민)이 쓰는 서버. 어드민에 서버 선택이 생기면 어드민은 이걸 쓰지 않는다.
export async function getDefaultServer() {
  const slug = process.env.DEFAULT_SERVER_SLUG;
  if (!slug) throw new Error("DEFAULT_SERVER_SLUG not set");
  const server = await getServerBySlug(slug);
  if (!server) throw new Error(`server "${slug}" not found`);
  return server;
}
