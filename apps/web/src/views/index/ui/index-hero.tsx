import { Badge, Container, HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { LockKeyhole } from "lucide-react";

import type { MenuServer } from "@/shared/ui";

import { HERO_CTA_ID } from "../model/hero-cta-id";
import { FeatureCarousel } from "./feature-carousel";
import { HeroBackdrop } from "./hero-backdrop";
import { IndexCta } from "./index-cta";

interface IndexHeroProps {
  // null이면 비로그인
  servers: MenuServer[] | null;
  joinable: MenuServer[];
  authError: boolean;
}

// 헤더(h-16)가 위에 겹쳐 있어 그만큼 위쪽 여백을 더 둔다.
export function IndexHero({ servers, joinable, authError }: IndexHeroProps) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundImage: "var(--gradient-onboarding)" }}
    >
      <HeroBackdrop />
      <Container className="relative">
        <HStack
          wrap
          align="center"
          className="gap-[clamp(40px,5cqw,64px)] pt-[calc(64px+clamp(28px,6cqw,80px))] pb-[clamp(48px,8cqw,104px)]"
        >
          <VStack gap="225" className="min-w-0 flex-[1_1_440px]">
            <HStack>
              <Badge colorPalette="primary">TRPG 세션 운영 도구</Badge>
            </HStack>
            <Text
              typography="heading1"
              render={<h1 />}
              className="text-[length:clamp(38px,5.4cqw,68px)] leading-[1.15] tracking-[-0.05em]"
            >
              구인부터 후기까지
              <br />
              <Text typography="heading1" foreground="primary" className="text-[length:inherit]">
                모두, 한 곳에서
              </Text>
            </Text>
            <Text
              typography="body2"
              foreground="muted"
              render={<p />}
              className="text-[length:clamp(15px,1.4cqw,17px)] leading-[1.7] [text-wrap:pretty]"
            >
              구인 신청부터 일정 조율, 출석과 후기까지
              <br />
              디스코드 서버 주소 하나에서 합니다.
            </Text>
            <VStack id={HERO_CTA_ID} gap="125" className="mt-100 w-full max-w-[360px]">
              <IndexCta servers={servers} joinable={joinable} authError={authError} />
              {isNull(servers) && (
                <HStack align="center" justify="center" gap="075" className="text-gray-600">
                  <LockKeyhole size={14} aria-hidden />
                  <Text typography="body4" foreground="muted">
                    로그인하면 내 서버가 보입니다
                  </Text>
                </HStack>
              )}
            </VStack>
          </VStack>
          <FeatureCarousel />
        </HStack>
      </Container>
    </div>
  );
}
