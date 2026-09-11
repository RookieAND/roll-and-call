import { HStack, Text, VStack } from "@trpg/ui";

// 구인 → 조율 → 확정 세 단계. 세로선으로 순서를 잇는다.
const STEPS = [
  { n: 1, title: "구인 등록", desc: "GM이 룰, 시놉시스, 인원, 모집 마감을 한 번에 올립니다." },
  {
    n: 2,
    title: "일정 조율",
    desc: "참여자가 30분 단위로 가능 시간을 칠하면 겹치는 슬롯이 후보로 올라옵니다.",
  },
  { n: 3, title: "세션 확정", desc: "GM이 고른 시간이 모두의 게임 카드에 확정으로 표시됩니다." },
];

export function LandingPitch() {
  return (
    <VStack gap={4} className="px-6">
      <Text typography="subtitle2" foreground="muted">
        HOW IT WORKS
      </Text>
      <VStack gap={0}>
        {STEPS.map((step, i) => (
          <HStack key={step.n} gap={3} align="stretch">
            <div className="flex flex-col items-center">
              <Text
                typography="subtitle2"
                foreground="primary"
                className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-primary-50"
              >
                {step.n}
              </Text>
              {i < STEPS.length - 1 && <span className="mt-1 w-px flex-1 bg-[#EAEAF0]" />}
            </div>
            <div className="pb-5">
              <Text typography="subtitle1">{step.title}</Text>
              <Text typography="body2" foreground="muted" className="mt-0.5 block">
                {step.desc}
              </Text>
            </div>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
