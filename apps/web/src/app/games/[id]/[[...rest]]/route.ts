import { isUuid, serverPath } from "@/shared/lib";
import { findGameServerSlug } from "@/shared/server";

// 서버 주소가 생기기 전의 구인 링크(/games/{id}…)를 그 구인의 서버로 보낸다. 못 찾으면 기본 서버의 같은 주소(404)로 보낸다.
export async function GET(request: Request, context: RouteContext<"/games/[id]/[[...rest]]">) {
  const { id, rest = [] } = await context.params;
  const url = new URL(request.url);
  const slug = isUuid(id) ? await findGameServerSlug(id) : undefined;
  url.pathname = serverPath({
    slug: slug ?? process.env.DEFAULT_SERVER_SLUG!,
    path: ["/games", id, ...rest].join("/"),
  });
  return Response.redirect(url, slug ? 308 : 307);
}
