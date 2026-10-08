import {
  Button,
  Card,
  Container,
  FloatingBar,
  Grid,
  HStack,
  Text,
  VStack,
} from "@roll-and-call/ui";

import { CERT_FORMAT_LABEL } from "@/entities/rulebook";
import { TRIAL_SAMPLE_PHOTO } from "@/shared/trial";
import { AppBar } from "@/shared/ui";

import { TRIAL_RULEBOOK_TITLE } from "../model/trial-rulebook";
import type { TrialCert } from "../model/trial-store";
import { TrialBanner } from "./trial-banner";
import { TrialRulebookRow } from "./trial-rulebook-row";

interface TrialCertDetailProps {
  cert: TrialCert;
  onBack: () => void;
}

const PHOTO_LABELS = ["앞면", "뒷면", "책등"] as const;

// 신청 상세(U13-07). 체험 신청이라 [신청 취소]는 누를 수 없는 설명용 버튼이다.
export function TrialCertDetail({ cert, onBack }: TrialCertDetailProps) {
  return (
    <>
      <AppBar title="신청 상세" onBack={onBack} heading={false} />
      <TrialBanner />
      <Container size="sm">
        <VStack gap="200" className="pt-200 pb-250">
          <Card.Root padding="none" className="overflow-hidden">
            <TrialRulebookRow
              title={TRIAL_RULEBOOK_TITLE}
              meta={`체험 신청 · ${CERT_FORMAT_LABEL[cert.format]}`}
              badge="심사 중"
              palette="warning"
            />
          </Card.Root>
          <Card.Root padding="none" className="overflow-hidden">
            <VStack>
              <Text typography="subtitle2" className="px-175 pt-150 pb-075">
                신청 내용
              </Text>
              {[
                ["📦", `형식 · ${CERT_FORMAT_LABEL[cert.format]}`],
                ["🕒", "상태 · 심사 중"],
              ].map(([emoji, text]) => (
                <HStack
                  key={text}
                  align="center"
                  gap="100"
                  className="min-h-12 border-t border-gray-100 px-175 py-075"
                >
                  <span aria-hidden>{emoji}</span>
                  <Text typography="body3">{text}</Text>
                </HStack>
              ))}
            </VStack>
          </Card.Root>
          <VStack gap="100">
            <Text typography="subtitle2">제출한 사진</Text>
            <Grid cols={3} gap="100">
              {PHOTO_LABELS.map((label) => (
                <VStack key={label} gap="050">
                  <img
                    src={TRIAL_SAMPLE_PHOTO}
                    alt={`${label} 샘플 사진`}
                    className="aspect-square w-full rounded-400 border border-gray-200 object-cover"
                  />
                  <Text typography="body5" foreground="hint" className="text-center">
                    {label}
                  </Text>
                </VStack>
              ))}
            </Grid>
          </VStack>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <Button variant="outline" colorPalette="danger" size="lg" className="w-full" disabled>
              신청 취소
            </Button>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
