import { Container, VStack } from "@trpg/ui";
import { LandingHero } from "./landing-hero";
import { LandingPitch } from "./landing-pitch";
import { LandingRecruitingPreview } from "./landing-recruiting-preview";

// 비로그인 랜딩: 소개 → 동작 방식 → 지금 모집 중.
export function HomeLanding() {
  return (
    <Container size="sm" className="px-0">
      <VStack gap={8} className="pb-10">
        <LandingHero />
        <LandingPitch />
        <LandingRecruitingPreview />
      </VStack>
    </Container>
  );
}
