"use client";

import { Badge, Card, Container, HStack, Text, VStack, toast } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { RECRUIT_METHOD } from "@/entities/game";
import { AppBar } from "@/shared/ui";

import type { TrialRecruit } from "../model/trial-store";
import { TrialBanner } from "./trial-banner";

interface TrialManageProps {
  recruit: TrialRecruit;
  onBack: () => void;
}

const BLOCKED_MESSAGE = "체험에서는 여기까지 볼 수 있습니다";

// 운영 관리. 줄을 누르면 다음 화면 대신 토스트만 띄운다.
export function TrialManage({ recruit, onBack }: TrialManageProps) {
  const method = recruit.recruitMethod === RECRUIT_METHOD.lottery ? "추첨" : "선착순";
  return (
    <>
      <AppBar title="운영 관리" onBack={onBack} heading={false} />
      <TrialBanner />
      <Container size="sm">
        <VStack gap="200" className="pt-200 pb-250">
          <VStack gap="050">
            <HStack align="center" gap="075">
              <Text typography="heading3" render={<h2 />} className="min-w-0 flex-1 truncate">
                {recruit.title}
              </Text>
              <Badge colorPalette="primary">모집 중</Badge>
            </HStack>
            <Text typography="body4" foreground="hint">
              {`체험 구인 · ${method} ${recruit.maxPlayers}명`}
            </Text>
          </VStack>
          <Card.Root padding="md">
            <HStack>
              {[
                ["신청자", "2"],
                ["정원", String(recruit.maxPlayers)],
              ].map(([label, value]) => (
                <VStack key={label} gap="025" className="flex-1">
                  <Text typography="body4" foreground="hint">
                    {label}
                  </Text>
                  <Text typography="heading3" numeric>
                    {value}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </Card.Root>
          <Card.Root padding="md">
            <HStack align="center" gap="100">
              <VStack gap="025" className="flex-1">
                <Text typography="body4" foreground="hint">
                  세션 시간
                </Text>
                <Text typography="body2" weight="bold">
                  미정
                </Text>
              </VStack>
              <Badge colorPalette="warning">조율 중</Badge>
            </HStack>
          </Card.Root>
          <Card.Root padding="none" className="overflow-hidden">
            <HStack
              align="center"
              gap="100"
              render={<button type="button" onClick={() => toast.info(BLOCKED_MESSAGE)} />}
              className="min-h-[62px] w-full cursor-pointer px-175 py-100 text-left"
            >
              <VStack className="min-w-0 flex-1">
                <Text typography="body2" weight="bold">
                  참여자 관리
                </Text>
                <Text typography="body4" foreground="hint" truncate>
                  체험 플레이어 1, 체험 플레이어 2
                </Text>
              </VStack>
              <Text typography="body4" foreground="muted">
                신청 2명
              </Text>
              <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
            </HStack>
          </Card.Root>
        </VStack>
      </Container>
    </>
  );
}
