"use client";

import { Card, Container, HStack, Text, VStack } from "@roll-and-call/ui";
import { useEffect } from "react";

import { AppBar } from "@/shared/ui";

import { TRIAL_RULEBOOK_TITLE } from "../model/trial-rulebook";
import { TRIAL_CERT_STATUS, type TrialCert } from "../model/trial-store";
import { TrialBanner } from "./trial-banner";
import { TrialRulebookRow } from "./trial-rulebook-row";

interface TrialMyRulebooksProps {
  cert: TrialCert;
  onBack: () => void;
  onOpenDetail: () => void;
  onApprove: () => void;
}

const APPROVE_DELAY_MS = 1500;

// 내 룰북(U13-01). 심사 중 줄이 잠시 뒤 인증됨으로 바뀐다(D399).
export function TrialMyRulebooks({ cert, onBack, onOpenDetail, onApprove }: TrialMyRulebooksProps) {
  const pending = cert.status === TRIAL_CERT_STATUS.pending;

  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(onApprove, APPROVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pending, onApprove]);

  return (
    <>
      <AppBar title="내 룰북" onBack={onBack} />
      <TrialBanner />
      <Container size="sm">
        <VStack gap="150" className="pt-200 pb-250" render={<section />}>
          <HStack align="baseline" gap="100">
            <Text typography="heading3" render={<h2 />}>
              {pending ? "인증 현황" : "인증한 룰북"}
            </Text>
            <Text typography="body3" weight="medium" foreground="muted">
              {pending ? "심사 중 1건" : "1권"}
            </Text>
          </HStack>
          <Card.Root padding="none" className="overflow-hidden">
            {pending ? (
              <TrialRulebookRow
                title={TRIAL_RULEBOOK_TITLE}
                meta="체험 신청 · 방금"
                badge="심사 중"
                palette="warning"
                onClick={onOpenDetail}
              />
            ) : (
              <TrialRulebookRow
                title={TRIAL_RULEBOOK_TITLE}
                meta="인증이 승인됐습니다."
                badge="인증됨"
                palette="success"
              />
            )}
          </Card.Root>
        </VStack>
      </Container>
    </>
  );
}
