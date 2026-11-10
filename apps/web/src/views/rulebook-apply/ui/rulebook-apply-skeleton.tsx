import { Container, Skeleton, Text, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

export function RulebookApplySkeleton() {
  return (
    <PageShell
      readable
      appBar={
        <AppBar
          back="/me/rulebooks/apply"
          title="인증 신청"
          heading={false}
          action={
            <Text typography="body4" foreground="hint" numeric className="px-100">
              2 / 3
            </Text>
          }
        />
      }
    >
      <div className={DESKTOP_CARD_CLASS}>
        <Container
          size="sm"
          className="flex min-h-[calc(100dvh-var(--rc-size-appbar)-var(--rc-size-tabbar)-var(--rc-safe-bottom))] flex-col desktop:min-h-0"
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
          <div className="sticky bottom-[calc(var(--rc-size-tabbar)+var(--rc-safe-bottom))] -mx-200 mt-auto bg-surface px-200 pt-100 pb-200 desktop:hidden">
            <Skeleton width="100%" height={104} rounded={300} />
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
