// 저장된 문서를 그대로 믿지 않는다. javascript:·data: 링크는 렌더 단계에서 떨군다.
export function safeHref(href: string | null | undefined): string | undefined {
  if (!href) return undefined;
  return /^https?:\/\//i.test(href) ? href : undefined;
}
