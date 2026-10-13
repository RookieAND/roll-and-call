export const LINK_PROVIDER = {
  discord: "discord",
  sheets: "sheets",
  docs: "docs",
  slides: "slides",
  forms: "forms",
  drive: "drive",
  notion: "notion",
  postype: "postype",
  trpgDiary: "trpgDiary",
} as const;
export type LinkProvider = (typeof LINK_PROVIDER)[keyof typeof LINK_PROVIDER];

// 칩에 이름을 따로 못 가져왔을 때 보여 주는 기본 라벨. 구인 상세의 플랫폼 태그 이름과 맞췄다.
export const LINK_PROVIDER_LABEL: Record<LinkProvider, string> = {
  discord: "디스코드 채널",
  sheets: "구글 스프레드시트",
  docs: "구글 문서",
  slides: "구글 슬라이드",
  forms: "구글 양식",
  drive: "구글 드라이브",
  notion: "노션 페이지",
  postype: "포스타입 글",
  trpgDiary: "TRPG Diary",
};
