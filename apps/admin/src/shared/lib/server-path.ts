const GLOBAL_PATH_PREFIX = "/platform/";

// 서버 화면 주소는 모두 이 함수로 만든다. path는 "/"로 시작하고, 서버 홈은 "/"다.
// 룰북 카탈로그(/platform/…)는 서버 밖 주소라 slug를 붙이지 않는다.
export function serverPath({ slug, path }: { slug: string; path: string }) {
  if (path.startsWith(GLOBAL_PATH_PREFIX)) return path;
  return path === "/" ? `/${slug}` : `/${slug}${path}`;
}
