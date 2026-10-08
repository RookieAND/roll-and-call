import { Button, Card, Container, FloatingBar, HStack, Text, VStack } from "@roll-and-call/ui";

import { ClearQuestButton } from "@/features/clear-quest";
import { AppBar } from "@/shared/ui";

import type { TrialKind } from "../model/trial-kind";
import type { TrialReview } from "../model/trial-store";
import { TrialBanner } from "./trial-banner";
import { TrialReviewCard } from "./trial-review-card";

interface TrialReviewResultProps {
  kind: TrialKind;
  review: TrialReview;
  onBack: () => void;
  onOpenSession: () => void;
}

const NOTICES = [
  ["💬", "디스코드 세션후기 포럼에도 올라갑니다."],
  ["✏️", "등록 후 7일 안에 고칠 수 있습니다."],
  ["🗑️", "삭제하면 같은 세션에 다시 쓸 수 없습니다."],
  ["🏅", "후기를 남기면 업적에 반영됩니다."],
] as const;

export function TrialReviewResult({ kind, review, onBack, onOpenSession }: TrialReviewResultProps) {
  return (
    <>
      <AppBar title="후기 쓰기" backIcon="close" onBack={onBack} heading={false} />
      <TrialBanner />
      <Container size="sm">
        <VStack gap="200" className="px-050 py-300">
          <Text typography="heading1" render={<h1 />}>
            후기를 남겼습니다.
          </Text>
          <TrialReviewCard kind={kind} review={review} />
          <Card.Root padding="none" className="overflow-hidden">
            {NOTICES.map(([emoji, text]) => (
              <HStack
                key={text}
                align="center"
                gap="100"
                className="min-h-12 border-t border-gray-100 px-175 py-075 first:border-t-0"
              >
                <span aria-hidden>{emoji}</span>
                <Text typography="body3">{text}</Text>
              </HStack>
            ))}
          </Card.Root>
          <Text typography="body4" foreground="muted" render={<p />}>
            실제로는 후기가 만들어지지 않았습니다.
          </Text>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <HStack gap="100">
              <Button variant="outline" size="lg" className="flex-1" onClick={onOpenSession}>
                후기 보기
              </Button>
              <ClearQuestButton quest="first_review" className="flex-1">
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
