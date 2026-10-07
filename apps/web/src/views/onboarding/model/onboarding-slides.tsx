// 줄바꿈은 시안이 정한 자리다. 문장 단위로 끊어야 412px에서 어절이 어정쩡하게 남지 않는다.
export const ONBOARDING_SLIDES = [
  {
    key: "welcome",
    eyebrow: null,
    title: (
      <>
        “안녕하세요,
        <br />
        롤앤콜입니다”
      </>
    ),
    body: (
      <>
        세션을 여는 사람과 찾는 사람이 만나는 곳입니다.
        <br />
        세 장에 걸쳐 할 수 있는 일을 보여 드립니다.
      </>
    ),
  },
  {
    key: "find",
    eyebrow: { number: "01", label: "구인 찾기" },
    title: (
      <>
        원하는 세션에
        <br />
        상세 화면에서 바로 신청합니다
      </>
    ),
    body: (
      <>
        모집 중인 글을 골라 상세 화면에서 신청합니다.
        <br />
        선착순은 자리가 남아 있으면 바로 확정됩니다.
        <br />
        추첨은 마감 때 무작위로 뽑습니다.
        <br />
        확정 후 대기자 없이 정원이 차거나 마감되면 취소할 수 없습니다.
      </>
    ),
  },
  {
    key: "host",
    eyebrow: { number: "02", label: "GM 시작하기" },
    title: (
      <>
        직접 세션을 열 때는
        <br />
        다섯 단계만 채우면 됩니다
      </>
    ),
    body: (
      <>
        구인 정보, 안내, 이미지, 모집, 일정 순서로 채웁니다.
        <br />
        등록한 뒤에도 내용을 고칠 수 있습니다.
        <br />
        인증이 필요한 룰은 룰북 인증을 마치면 고를 수 있습니다.
      </>
    ),
  },
  {
    key: "profile",
    eyebrow: { number: "03", label: "프로필" },
    title: (
      <>
        GM이 보는 프로필에
        <br />
        소개와 링크를 채워 두세요
      </>
    ),
    body: (
      <>
        GM은 참여자 관리에서 신청자 프로필을 확인합니다.
        <br />
        디스코드, 노션 같은 링크를 여섯 개까지 걸 수 있습니다.
        <br />
        프로필은 마이페이지에서 언제든 고칠 수 있습니다.
      </>
    ),
  },
] as const;

export type OnboardingSlide = (typeof ONBOARDING_SLIDES)[number];
