import { Container, FloatingBar, HStack, Progress, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

import { GAME_FORM_STEPS } from "../model/game-form-steps";

interface GameFormSkeletonProps {
  title: string;
  edit?: boolean;
}

// 위저드 1단계(게임)의 셸. 어느 단계인지 모르는 동안 진행바는 비워 둔다.
export function GameFormSkeleton({ title, edit = false }: GameFormSkeletonProps) {
  const total = GAME_FORM_STEPS.length;

  return (
    <VStack className="min-h-dvh">
      <AppBar back="/games" backIcon="close" title={title} />
      <Progress
        value={0}
        max={total}
        colorPalette="gray"
        aria-label={`${title} 불러오는 중`}
        className="h-[3px] rounded-none"
      />
      <Container size="md" className="flex-1">
        <VStack gap="250" className="py-300">
          <div>
            <Skeleton width={48} height={26} />
            <Skeleton width={200} height={20} className="mt-050" />
          </div>
          {edit && <Skeleton width="100%" height={76} rounded={500} />}
          <VStack gap="075">
            <Skeleton width={48} height={18} />
            <Skeleton width="100%" height={44} rounded={400} />
          </VStack>
          <VStack gap="075">
            <Skeleton width={24} height={18} />
            <Skeleton width="100%" height={44} rounded={400} />
            <HStack gap="075">
              <Skeleton width={72} rounded="full" height={32} />
              <Skeleton width={64} rounded="full" height={32} />
              <Skeleton width={72} rounded="full" height={32} />
            </HStack>
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
            <Skeleton width="100%" height={96} rounded={400} />
          </VStack>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <HStack gap="100" className="[&>*]:flex-1">
            {edit && <Skeleton height={48} rounded={500} />}
            <Skeleton height={48} rounded={500} />
          </HStack>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </VStack>
  );
}
