import {
  Container,
  FloatingBar,
  HStack,
  Progress,
  Skeleton,
  Text,
  VStack,
} from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

import { GAME_FORM_STEPS } from "../model/game-form-steps";

interface GameFormSkeletonProps {
  title: string;
  edit?: boolean;
}

export function GameFormSkeleton({ title, edit = false }: GameFormSkeletonProps) {
  const total = GAME_FORM_STEPS.length;

  return (
    <VStack className="min-h-dvh">
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
      <Container size="md" className="flex-1">
        <VStack gap="250" className="py-300">
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
          <Container size="md">
            <HStack gap="100" className="[&>*]:flex-1">
              {edit && <Skeleton height={48} rounded={500} />}
              <Skeleton height={48} rounded={500} />
            </HStack>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </VStack>
  );
}
