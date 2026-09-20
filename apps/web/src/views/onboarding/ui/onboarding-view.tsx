"use client";

import { Button, Container, Text, VStack, cn } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { markOnboardingSeen } from "../model/onboarding-seen";
import { ONBOARDING_SLIDES } from "../model/onboarding-slides";
import { OnboardingPreview } from "./onboarding-preview";

const DONE_HREF = "/games";

export function OnboardingView() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  // 건너뛰기든 끝까지 보든 두 번 뜨지 않게, 들어온 순간 본 것으로 친다.
  useEffect(markOnboardingSeen, []);

  const slide = ONBOARDING_SLIDES[index]!;
  const last = index === ONBOARDING_SLIDES.length - 1;
  const nextLabel = last ? "구인 목록 보러 가기" : "다음";

  const goNext = () => {
    if (last) {
      router.replace(DONE_HREF);
      return;
    }
    setIndex(index + 1);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-[52px] items-center justify-end px-2.5">
        {!last && (
          <Button variant="ghost" onClick={() => router.replace(DONE_HREF)}>
            건너뛰기
          </Button>
        )}
      </header>
      <Container size="sm" className="flex flex-1 flex-col">
        <div className="flex h-[242px] items-center justify-center rounded-[14px] border border-gray-100 bg-gray-50">
          <OnboardingPreview slideKey={slide.key} />
        </div>
        <VStack gap={3} className="mt-6">
          <Text typography="code2" foreground="primary" render={<p />} className="tracking-widest">
            {slide.eyebrow}
          </Text>
          <Text typography="heading1" render={<h1 />} className="text-[24px]">
            {slide.title}
          </Text>
          <Text typography="body2" foreground="muted" render={<p />} className="leading-[1.8]">
            {slide.body}
          </Text>
        </VStack>
        <span className="flex-1" />
        <div className="flex justify-center gap-1.5 py-4">
          {ONBOARDING_SLIDES.map((item, itemIndex) => (
            <span
              key={item.key}
              className={cn(
                "h-1.5 rounded-full",
                itemIndex === index ? "w-5 bg-primary-600" : "w-1.5 bg-gray-200",
              )}
            />
          ))}
        </div>
        <Button size="lg" className="mb-6 w-full" onClick={goNext}>
          {nextLabel}
        </Button>
      </Container>
    </div>
  );
}
