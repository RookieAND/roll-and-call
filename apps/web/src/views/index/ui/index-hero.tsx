import { Badge, Container, HStack, Text, VStack } from "@roll-and-call/ui";
import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";

import { LoginButton } from "@/features/auth";

import { FeatureCarousel } from "./feature-carousel";
import { IndexHeader } from "./index-header";

interface IndexHeroProps {
  signedIn: boolean;
  children?: ReactNode;
}

// children은 헤더 바로 아래, 소개 문구 위에 놓인다(로그인했을 때의 내 서버 목록).
export function IndexHero({ signedIn, children }: IndexHeroProps) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundImage: "var(--gradient-onboarding)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[size:22px_22px] [mask-image:linear-gradient(180deg,black_0%,transparent_85%)]"
        style={{
          backgroundImage: "radial-gradient(var(--rc-color-border-normal) 1px, transparent 1.2px)",
        }}
      />
      <IndexHeader />
      {children}
      <Container className="relative">
        <HStack
          wrap
          align="center"
          className="gap-[clamp(40px,5cqw,64px)] pt-[clamp(28px,6cqw,80px)] pb-[clamp(48px,8cqw,104px)]"
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
              TRPG 를 좋아하고 사랑하는 사람들을 위해
              <br />
              Roll &amp; Call 에서는 다양하고 편리한 기능을 제공합니다.
            </Text>
            {!signedIn && (
              <VStack gap="125" className="mt-100 w-full max-w-[340px]">
                <LoginButton next="/" className="w-full" />
                <HStack align="center" justify="center" gap="075" className="text-gray-600">
                  <LockKeyhole size={14} aria-hidden />
                  <Text typography="body4" foreground="muted">
                    로그인하면 내 서버가 보여요
                  </Text>
                </HStack>
              </VStack>
            )}
          </VStack>
          <FeatureCarousel />
        </HStack>
      </Container>
    </div>
  );
}
