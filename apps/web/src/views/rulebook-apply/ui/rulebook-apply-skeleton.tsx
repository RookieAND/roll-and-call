import { Container, Progress, Skeleton, Text, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar } from "@/shared/ui";

export function RulebookApplySkeleton() {
  return (
    <>
      <AppBar
        back="/me/rulebooks"
        backIcon="close"
        title="인증 신청"
        heading={false}
        action={
          <Text typography="body4" foreground="hint" numeric className="px-100">
            1 / 2
          </Text>
        }
      />
      <Progress value={1} max={2} className="h-[3px] rounded-none" aria-label="진행" />
      <Container
        size="sm"
        className="flex min-h-[calc(100dvh-var(--rc-size-appbar)-var(--rc-size-tabbar)-var(--rc-safe-bottom)-3px)] flex-col"
      >
        <VStack gap="200" aria-busy className="pt-250 pb-250">
          <VStack gap="050">
            <Skeleton width={160} height={26} />
            <Skeleton width={140} height={21} />
          </VStack>
          <Skeleton width="100%" height={48} rounded={300} />
          <VStack gap="200">
            {range(2).map((category) => (
              <VStack key={category} gap="200" className="rounded-600 bg-gray-50 p-200">
                <Skeleton width={120} height={24} />
                {range(2).map((row) => (
                  <Skeleton key={row} width="100%" height={60} rounded={500} />
                ))}
              </VStack>
            ))}
          </VStack>
        </VStack>
        <div className="sticky bottom-[calc(var(--rc-size-tabbar)+var(--rc-safe-bottom))] -mx-200 mt-auto bg-surface px-200 pt-100 pb-200">
          <Skeleton width="100%" height={104} rounded={300} />
        </div>
      </Container>
    </>
  );
}
