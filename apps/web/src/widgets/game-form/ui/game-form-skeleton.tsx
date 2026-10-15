import {
  cn,
  Container,
  FloatingBar,
  HStack,
  Progress,
  Skeleton,
  Text,
  VStack,
} from "@roll-and-call/ui";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

import { GAME_FORM_STEPS } from "../model/game-form-steps";

interface GameFormSkeletonProps {
  title: string;
  edit?: boolean;
}

export function GameFormSkeleton({ title, edit = false }: GameFormSkeletonProps) {
  const total = GAME_FORM_STEPS.length;

  return (
    <PageShell
      readable
      appBar={
        <>
          <AppBar
            back="/games"
            backIcon="close"
            title={title}
            action={
              <Text numeric typography="body4" foreground="hint" className="mr-050">
                1 / {total}
              </Text>
            }
          />
          <Progress
            value={1}
            max={total}
            colorPalette="primary"
            aria-label={`${title} 불러오는 중`}
            className="h-[3px] rounded-none"
          />
        </>
      }
      panel={
        <VStack gap="250" aria-hidden>
          <VStack gap="125">
            <Skeleton width={56} height={18} />
            <Skeleton width="100%" height={112} rounded={500} />
          </VStack>
          <VStack gap="125">
            <Skeleton width={56} height={18} />
            <Skeleton width="100%" height={236} rounded={400} />
          </VStack>
        </VStack>
      }
    >
      <div className={cn("flex min-h-[calc(100dvh-var(--rc-size-appbar)-3px)] flex-col desktop:min-h-0", DESKTOP_CARD_CLASS)}>
        <Container size="md" className="flex-1 desktop:max-w-none desktop:px-400">
          <VStack gap="250" className="py-300 desktop:py-400">
            <div>
              <Skeleton width={96} height={26} />
              <Skeleton width={220} height={20} className="mt-050" />
            </div>
            {edit && <Skeleton width="100%" height={88} rounded={500} />}
            <VStack gap="075">
              <Skeleton width={56} height={18} />
              <Skeleton width="100%" height={44} rounded={400} />
            </VStack>
            <VStack gap="100">
              <Skeleton width={16} height={18} />
              <Skeleton width="100%" height={56} rounded={500} />
            </VStack>
            <VStack gap="075">
              <Skeleton width={64} height={18} />
              <HStack gap="100">
                <Skeleton height={44} rounded={400} className="flex-1" />
                <Skeleton height={44} rounded={400} className="flex-1" />
              </HStack>
            </VStack>
            <VStack gap="075">
              <Skeleton width={56} height={18} />
              <Skeleton width="100%" height={180} rounded={400} />
            </VStack>
            <VStack gap="075">
              <Skeleton width={32} height={18} />
              <Skeleton width="100%" height={44} rounded={400} />
            </VStack>
          </VStack>
        </Container>
        <FloatingBar.Root elevated={false}>
          <FloatingBar.Content>
            <Container size="md" className="desktop:max-w-160 desktop:px-0">
              <HStack gap="100" className="[&>*]:flex-1">
                {edit && <Skeleton height={48} rounded={500} />}
                <Skeleton height={48} rounded={500} />
              </HStack>
            </Container>
          </FloatingBar.Content>
          <FloatingBar.Spacer />
        </FloatingBar.Root>
      </div>
    </PageShell>
  );
}
