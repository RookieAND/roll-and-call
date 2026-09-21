import { Container, HStack, Skeleton, Text, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

import { GAME_FORM_STEPS } from "../model/game-form-steps";

interface GameFormSkeletonProps {
  title: string;
  edit?: boolean;
}

// 위저드 1단계(게임)의 셸. 진행바는 5단계 중 1단계까지 칠한다.
export function GameFormSkeleton({ title, edit = false }: GameFormSkeletonProps) {
  const total = GAME_FORM_STEPS.length;

  return (
    <VStack className="min-h-dvh">
      <AppBar
        back="/games"
        backIcon="close"
        title={title}
        action={
          <Text numeric typography="subtitle2" foreground="muted">
            1 / {total}
          </Text>
        }
      />
      <div className="h-[3px] bg-gray-100">
        <div className="h-full bg-primary-600" style={{ width: `${100 / total}%` }} />
      </div>
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
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-surface">
        <Container size="md" className="flex gap-100 py-150">
          {edit && <Skeleton height={50} rounded={500} className="flex-1" />}
          <Skeleton height={50} rounded={500} className="flex-1" />
        </Container>
      </div>
    </VStack>
  );
}
