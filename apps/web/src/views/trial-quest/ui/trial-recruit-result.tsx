import {
  Badge,
  Button,
  Card,
  Container,
  FloatingBar,
  HStack,
  Text,
  VStack,
} from "@roll-and-call/ui";

import { RECRUIT_METHOD } from "@/entities/game";
import { ClearQuestButton } from "@/features/clear-quest";
import { AppBar } from "@/shared/ui";

import type { TrialRecruit } from "../model/trial-store";
import { TrialBanner } from "./trial-banner";

interface TrialRecruitResultProps {
  recruit: TrialRecruit;
  onBack: () => void;
  onOpenList: () => void;
}

const GM_TASKS = [
  [
    "🗓️",
    "조율형이면 조율 기간이 끝나고 7일 안에 세션 시각을 기록해 주세요. 지나면 「취소됨」이 됩니다.",
  ],
  ["✅", "세션이 끝나고 24시간 안에 출석을 확정해 주세요."],
  ["💬", "출석이 확정되면 참석자가 후기를 남길 수 있습니다."],
] as const;

export function TrialRecruitResult({ recruit, onBack, onOpenList }: TrialRecruitResultProps) {
  const method = recruit.recruitMethod === RECRUIT_METHOD.lottery ? "추첨" : "선착순";
  return (
    <>
      <AppBar title="구인 등록" onBack={onBack} heading={false} />
      <TrialBanner />
      <Container size="sm">
        <VStack gap="200" className="px-050 py-300">
          <Text typography="heading1" render={<h1 />}>
            구인을 등록했습니다.
          </Text>
          <Card.Root padding="md">
            <VStack gap="100">
              <HStack gap="050">
                <Badge colorPalette="primary">모집 중</Badge>
                <Badge colorPalette="gray">CoC 7판</Badge>
              </HStack>
              <Text typography="subtitle1">{recruit.title}</Text>
              <VStack gap="025">
                <Text typography="body3" foreground="muted">
                  {`체험 GM · ${method} ${recruit.maxPlayers}명`}
                </Text>
                <Text typography="body3" foreground="muted">
                  신청은 구인 상세에서 받습니다.
                </Text>
              </VStack>
            </VStack>
          </Card.Root>
          <Card.Root padding="none" className="overflow-hidden">
            <Text typography="subtitle2" className="px-175 pt-150 pb-075">
              GM이 해야 할 일
            </Text>
            {GM_TASKS.map(([emoji, text]) => (
              <HStack
                key={text}
                align="start"
                gap="100"
                className="border-t border-gray-100 px-175 py-100"
              >
                <span aria-hidden>{emoji}</span>
                <Text typography="body3" className="min-w-0 flex-1 break-keep">
                  {text}
                </Text>
              </HStack>
            ))}
          </Card.Root>
          <Text typography="body4" foreground="muted" render={<p />}>
            실제로는 구인이 만들어지지 않았습니다.
          </Text>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <HStack gap="100">
              <Button variant="outline" size="lg" className="flex-1" onClick={onOpenList}>
                내 구인 보기
              </Button>
              <ClearQuestButton quest="first_recruit" className="flex-1">
                다음
              </ClearQuestButton>
            </HStack>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
