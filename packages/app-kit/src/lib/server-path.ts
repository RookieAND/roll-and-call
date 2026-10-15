// 서버 화면 주소는 모두 이 함수로 만든다. path는 "/"로 시작하고, 서버 홈은 "/"다.
export function serverPath({ slug, path }: { slug: string; path: string }) {
  return path === "/" ? `/${slug}` : `/${slug}${path}`;
}
