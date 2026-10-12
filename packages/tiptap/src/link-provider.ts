export const LINK_PROVIDER = {
  discord: "discord",
  sheets: "sheets",
  notion: "notion",
} as const;
export type LinkProvider = (typeof LINK_PROVIDER)[keyof typeof LINK_PROVIDER];

// 칩에 이름을 따로 못 가져왔을 때 보여 주는 기본 라벨. 구인 상세의 플랫폼 태그 이름과 맞췄다.
export const LINK_PROVIDER_LABEL: Record<LinkProvider, string> = {
  discord: "디스코드 채널",
  sheets: "구글 스프레드시트",
  notion: "노션 페이지",
};
