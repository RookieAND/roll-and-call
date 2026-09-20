// 줄바꿈은 시안이 정한 자리다. 문장 단위로 끊어야 412px에서 어절이 어정쩡하게 남지 않는다.
export const ONBOARDING_SLIDES = [
  {
    key: "find",
    eyebrow: "01 · 구인 찾기",
    title: "열려 있는 세션을 찾아\n신청합니다",
    body: "구인 목록에서 모집 중인 세션을 고르고 상세에서 신청합니다.\n선착순이면 자리가 남아 있을 때 바로 확정되고,\n추첨이면 기한이 지난 뒤 GM이 뽑습니다.",
  },
  {
    key: "schedule",
    eyebrow: "02 · 일정 조율",
    title: "되는 시간을 칠하면\n겹치는 칸이 진해집니다",
    body: "참여가 확정되면 조율 격자가 열립니다.\n가능한 시간대를 끌어서 칠하세요.\n가장 진한 칸을 보고 GM이 일정을 확정합니다.",
  },
  {
    key: "host",
    eyebrow: "03 · GM 시작하기",
    title: "네 단계면\n직접 세션을 엽니다",
    body: "게임, 참여 전 안내, 이미지, 모집 순서로 채웁니다.\n정원과 소개는 연 다음에도 고칠 수 있습니다.\n모인 사람의 일정은 조율 격자가 대신 모아줍니다.",
  },
  {
    key: "profile",
    eyebrow: "04 · 프로필",
    title: "소개와 링크를\n채워두세요",
    body: "GM은 신청자를 볼 때 프로필을 참고합니다.\n디스코드·노션 같은 링크를 여섯 개까지 걸 수 있습니다.\n마이페이지에서 언제든 고칠 수 있습니다.",
  },
] as const;

export type OnboardingSlide = (typeof ONBOARDING_SLIDES)[number];
