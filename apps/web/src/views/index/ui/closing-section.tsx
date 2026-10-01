import { Container, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { LoginButton } from "@/features/auth";

import { INQUIRY_URL } from "../model/inquiry-url";
import { ClosingLinkCard } from "./closing-link-card";
import { SparkleStar } from "./sparkle-star";

interface ClosingSectionProps {
  signedIn: boolean;
}

export function ClosingSection({ signedIn }: ClosingSectionProps) {
  return (
    <Container
      render={<section />}
      className="pt-[clamp(56px,8cqw,104px)] pb-[clamp(40px,5cqw,64px)]"
    >
      <VStack gap="175">
        {!signedIn && (
          <VStack
            align="center"
            gap="175"
            className="relative overflow-hidden rounded-800 border border-gray-200 px-[clamp(20px,4cqw,48px)] py-[clamp(32px,5cqw,56px)] text-center"
            style={{ backgroundImage: "var(--gradient-onboarding)" }}
          >
            <SparkleStar size={22} className="absolute top-200 left-200 text-gm" />
            <SparkleStar size={14} className="absolute right-200 bottom-200 text-tinted-ink" />
            <Text
              typography="heading1"
              render={<h2 />}
              className="text-[length:clamp(22px,2.6cqw,30px)] leading-[1.35]"
            >
              내 서버의 세션을 확인해 보세요
            </Text>
            <Text typography="body2" foreground="muted" render={<p />}>
              서버 목록은 공개하지 않습니다.
              <br />
              로그인하면 내가 속한 서버만 보입니다.
            </Text>
            <div className="mt-075 w-full max-w-[320px]">
              <LoginButton next="/" className="w-full" />
            </div>
          </VStack>
        )}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-175">
          <ClosingLinkCard
            title="서버 운영자이신가요?"
            description={
              <>
                우리 서버에도 Roll &amp; Call을 쓰고 싶다면 문의해 주세요.
                <br />
                서버 등록은 Roll &amp; Call 운영팀이 직접 해 드립니다.
              </>
            }
            actionLabel="도입 문의하기"
            link={<a href={INQUIRY_URL} target="_blank" rel="noreferrer" />}
          />
          <ClosingLinkCard
            title="처음이라면 도움말부터"
            description={
              <>
                신청부터 후기까지 화면별로 설명합니다.
                <br />
                상태 용어도 한 페이지에 모아 두었습니다.
              </>
            }
            actionLabel="도움말 보기"
            link={<Link href="/help" />}
          />
        </div>
      </VStack>
    </Container>
  );
}
