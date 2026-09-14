import { Container, VStack } from "@trpg/ui";
import { LandingHero } from "./landing-hero";
import { LandingRecruitingPreview } from "./landing-recruiting-preview";

// 비로그인 랜딩: 소개 → 지금 모집 중.
// ponytail: 3단계 "HOW IT WORKS" 블록을 뺐다. 히어로 한 문장 + 실제 모집 글이 설명을 대신한다.
export function HomeLanding({ authError }: { authError: boolean }) {
  return (
    <Container size="sm" className="px-0">
      <VStack gap={6} className="pb-10">
        <LandingHero authError={authError} />
        <LandingRecruitingPreview />
      </VStack>
    </Container>
  );
}
