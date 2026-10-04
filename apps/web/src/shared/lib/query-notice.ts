// 다른 화면으로 보내면서 그 화면에 토스트를 한 번 띄울 때 주소에 붙이는 검색 인자.
export const QUERY_NOTICE_PARAM = "notice";

export const QUERY_NOTICE = {
  noDrawResult: "no-draw-result",
} as const;

export type QueryNotice = (typeof QUERY_NOTICE)[keyof typeof QUERY_NOTICE];
