import {
  Button,
  Card,
  Collapsible,
  Container,
  FloatingBar,
  HStack,
  Text,
  VStack,
} from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";

import { ClearQuestButton } from "@/features/clear-quest";
import { AppBar, ServerLink } from "@/shared/ui";

import { TRIAL_RULEBOOK_TITLE } from "../model/trial-rulebook";
import { TrialBanner } from "./trial-banner";
import { TrialRulebookRow } from "./trial-rulebook-row";

interface TrialCertResultProps {
  onBack: () => void;
  onOpenMine: () => void;
}

const REJECT_REASON = "닉네임 쪽지가 보이지 않습니다.";

export function TrialCertResult({ onBack, onOpenMine }: TrialCertResultProps) {
  return (
    <>
      <AppBar title="인증 신청" onBack={onBack} heading={false} />
      <TrialBanner />
      <Container size="sm">
        <VStack gap="200" className="px-050 py-300">
          <Text typography="heading1" render={<h1 />}>
            신청을 받았습니다.
          </Text>
          <Card.Root padding="none" className="overflow-hidden">
            <TrialRulebookRow
              title={TRIAL_RULEBOOK_TITLE}
              meta="심사 중입니다."
              badge="심사 중"
              palette="warning"
            />
          </Card.Root>
          <Text typography="body4" foreground="muted" render={<p />}>
            체험에서는 심사가 바로 끝납니다.
          </Text>
          <Card.Root padding="none" className="overflow-hidden">
            <TrialRulebookRow
              title={TRIAL_RULEBOOK_TITLE}
              meta="인증이 승인됐습니다."
              badge="인증됨"
              palette="success"
            />
          </Card.Root>
          <Card.Root padding="none" className="overflow-hidden">
            <Collapsible.Root>
              <Collapsible.Trigger className="group block w-full cursor-pointer p-200 text-left">
                <HStack align="center" gap="100">
                  <Text typography="subtitle2" className="min-w-0 flex-1">
                    반려되면
                  </Text>
                  <ChevronDown
                    size={18}
                    aria-hidden
                    className="flex-none text-hint transition-transform group-data-panel-open:rotate-180"
                  />
                </HStack>
              </Collapsible.Trigger>
              <Collapsible.Panel>
                <VStack gap="050" className="border-t border-gray-100 bg-gray-50 p-200">
                  <Text typography="body4" foreground="hint">
                    반려 사유 예시
                  </Text>
                  <Text typography="body3">{REJECT_REASON}</Text>
                </VStack>
              </Collapsible.Panel>
            </Collapsible.Root>
          </Card.Root>
          <Text typography="body4" foreground="muted" render={<p />}>
            체험이라 실제 인증은 되지 않았습니다.
          </Text>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <VStack gap="100">
              <HStack gap="100">
                <Button variant="outline" size="lg" className="flex-1" onClick={onOpenMine}>
                  내 룰북 보기
                </Button>
                <ClearQuestButton quest="rulebook_cert" className="flex-1">
                  다음
                </ClearQuestButton>
              </HStack>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                render={<ServerLink path="/me/rulebooks/apply" data-trial-exit />}
              >
                실제로 인증 신청하기
              </Button>
            </VStack>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
