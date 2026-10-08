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
import { BookOpen } from "lucide-react";

import { ClearQuestButton } from "@/features/clear-quest";
import { AppBar } from "@/shared/ui";

import {
  otherTrialKind,
  TRIAL_BOTH_COPY,
  TRIAL_GAME_TITLE,
  TRIAL_RESULT_COPY,
} from "../model/trial-copy";
import { TRIAL_KIND, type TrialKind } from "../model/trial-kind";
import { TrialBanner } from "./trial-banner";

interface TrialApplyResultProps {
  kind: TrialKind;
  applied: Partial<Record<TrialKind, true>>;
  onBack: () => void;
  onTryOther: (kind: TrialKind) => void;
}

export function TrialApplyResult({ kind, applied, onBack, onTryOther }: TrialApplyResultProps) {
  const both = Boolean(applied[TRIAL_KIND.firstCome] && applied[TRIAL_KIND.lottery]);
  const copy = both ? TRIAL_BOTH_COPY : TRIAL_RESULT_COPY[kind];
  const rows = [TRIAL_KIND.firstCome, TRIAL_KIND.lottery].filter(
    (rowKind) => applied[rowKind] && (both || rowKind === kind),
  );

  return (
    <>
      <AppBar title="신청 결과" onBack={onBack} heading={false} />
      <TrialBanner>
        <Badge colorPalette="gray">메인 퀘스트</Badge>
      </TrialBanner>
      <Container size="sm">
        <VStack gap="250" className="px-050 py-300">
          <VStack gap="075">
            <Text typography="heading1" render={<h1 />}>
              {copy.title}
            </Text>
            <Text typography="body2" foreground="muted" render={<p />} className="break-keep">
              {copy.description}
            </Text>
          </VStack>
          <Card.Root padding="none" className="overflow-hidden">
            {rows.map((rowKind) => (
              <HStack
                key={rowKind}
                align="center"
                gap="125"
                className="min-h-14 border-t border-gray-100 px-175 py-100 first:border-t-0"
              >
                <BookOpen size={18} aria-hidden className="flex-none text-hint" />
                <VStack className="min-w-0 flex-1">
                  <Text typography="body2" weight="bold">
                    {TRIAL_GAME_TITLE[rowKind]}
                  </Text>
                  <Text typography="body4" foreground="hint">
                    {TRIAL_RESULT_COPY[rowKind].meta}
                  </Text>
                </VStack>
                <Badge colorPalette={rowKind === TRIAL_KIND.firstCome ? "success" : "warning"}>
                  {TRIAL_RESULT_COPY[rowKind].badge}
                </Badge>
              </HStack>
            ))}
          </Card.Root>
          <Text typography="body4" foreground="muted" render={<p />}>
            실제로는 신청이 만들어지지 않았습니다.
          </Text>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <HStack gap="100">
              <Button
                variant="outline"
                colorPalette="gray"
                size="lg"
                className="flex-1"
                onClick={() => onTryOther(otherTrialKind(kind))}
              >
                다른 방식도 해 보기
              </Button>
              <ClearQuestButton quest="first_apply" className="flex-1">
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
