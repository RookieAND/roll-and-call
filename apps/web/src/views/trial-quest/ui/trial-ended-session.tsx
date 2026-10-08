import { Badge, Card, Container, HStack, Text, VStack } from "@roll-and-call/ui";

import { SessionHeading } from "@/entities/game";
import { AppBar } from "@/shared/ui";

import { TRIAL_GAME_TITLE } from "../model/trial-copy";
import type { TrialKind } from "../model/trial-kind";
import type { TrialReview } from "../model/trial-store";
import { TrialBanner } from "./trial-banner";
import { TrialReviewCard } from "./trial-review-card";

interface TrialEndedSessionProps {
  kind: TrialKind;
  review: TrialReview;
  onBack: () => void;
}

// 끝난 체험 세션. 방금 쓴 체험 후기가 후기 카드로 보이고 후기 개수가 1 늘어난다(D399).
export function TrialEndedSession({ kind, review, onBack }: TrialEndedSessionProps) {
  return (
    <>
      <AppBar title="구인 상세" onBack={onBack} heading={false} />
      <TrialBanner />
      <Container size="md">
        <VStack gap="200" className="px-050 py-200">
          <VStack gap="100">
            <SessionHeading
              title={TRIAL_GAME_TITLE[kind]}
              rule="CoC 7th"
              subline="체험 GM · CoC 7판"
            />
            <Badge colorPalette="gray" className="self-start">
              세션 종료
            </Badge>
          </VStack>
          <Card.Root padding="md">
            <HStack>
              <VStack gap="025" className="flex-1">
                <Text typography="body4" foreground="hint">
                  세션 일시
                </Text>
                <Text typography="body2" weight="bold">
                  오늘
                </Text>
              </VStack>
              <VStack gap="025" className="flex-1">
                <Text typography="body4" foreground="hint">
                  작성된 후기
                </Text>
                <Text typography="body2" weight="bold" numeric>
                  1개
                </Text>
              </VStack>
            </HStack>
          </Card.Root>
          <HStack align="baseline" gap="075">
            <Text typography="heading3" render={<h2 />}>
              후기 보기
            </Text>
            <Text typography="body4" foreground="hint" numeric>
              1개
            </Text>
          </HStack>
          <TrialReviewCard kind={kind} review={review} tagged />
        </VStack>
      </Container>
    </>
  );
}
