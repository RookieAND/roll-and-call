// 서비스를 가리지 않고 http·https 주소면 받는다.
export function isWebLink(link: string) {
  if (!URL.canParse(link)) return false;
  const { protocol } = new URL(link);
  return protocol === "http:" || protocol === "https:";
}
