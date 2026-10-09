import { Container, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { BrandLogo, HelpButton, ThemeToggleButton } from "@/shared/ui";

export function IndexSkeleton() {
  return (
    <main id="main" aria-busy className="@container min-h-dvh bg-surface text-gray-900">
      <Container render={<header />}>
        <HStack align="center" gap="050" className="h-16">
          <div className="flex min-w-0 flex-1">
            <BrandLogo label="Roll & Call" />
          </div>
          <HelpButton />
          <ThemeToggleButton />
        </HStack>
      </Container>
      <div style={{ backgroundImage: "var(--gradient-onboarding)" }}>
        <Container>
          <HStack
            wrap
            align="center"
            className="gap-[clamp(40px,5cqw,64px)] pt-[clamp(28px,6cqw,80px)] pb-[clamp(48px,8cqw,104px)]"
          >
            <VStack gap="225" className="min-w-0 flex-[1_1_440px]">
              <Skeleton width={144} height={24} rounded="full" />
              <VStack gap="100">
                <Skeleton width="80%" height={48} />
                <Skeleton width="60%" height={48} />
              </VStack>
              <VStack gap="050">
                <Skeleton width="70%" height={20} />
                <Skeleton width="55%" height={20} />
              </VStack>
              <Skeleton height={52} rounded={400} className="mt-100 w-full max-w-[360px]" />
            </VStack>
            <Skeleton height={320} rounded={600} className="min-w-0 flex-[1_1_360px]" />
          </HStack>
        </Container>
      </div>
    </main>
  );
}
