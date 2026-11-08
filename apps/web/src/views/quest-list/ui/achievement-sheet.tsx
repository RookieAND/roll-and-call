"use client";

import { ONBOARDING_QUESTS } from "@roll-and-call/database/onboarding/model";
import { Badge, Button, HStack, Sheet, Text, VStack } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { useServerPath } from "@/shared/lib";

interface AchievementSheetProps {
  open: boolean;
}

// 마지막 퀘스트를 깨서 견습 모험가를 받은 직후에 한 번 보인다. 모션은 한 번뿐이고 컨페티·반짝임은 쓰지 않는다.
export function AchievementSheet({ open }: AchievementSheetProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const listPath = toServerPath("/onboarding");

  return (
    <Sheet.Root open={open} onOpenChange={(next) => !next && router.replace(listPath)}>
      <Sheet.Overlay />
      <Sheet.Popup
        aria-label="업적을 받았습니다"
        className="motion-safe:animate-quest-rise desktop:animate-none"
      >
        <Sheet.Handle />
        <VStack align="center" gap="175" className="pt-200 text-center">
          <span
            aria-hidden
            className="flex size-28 items-center justify-center rounded-full border-3 border-primary-600 bg-primary-50 text-[length:var(--icon-emblem)] leading-none"
          >
            🧭
          </span>
          <VStack align="center" gap="075">
            <Text typography="body3" weight="extrabold" foreground="primary">
              업적을 받았습니다
            </Text>
            <Sheet.Title className="text-heading1">견습 모험가</Sheet.Title>
            <Text typography="body2" foreground="muted" render={<p />}>
              <span className="block">튜토리얼 퀘스트를 모두 마쳤습니다.</span>
              <span className="block">업적 도감에서 다시 볼 수 있습니다.</span>
            </Text>
          </VStack>
          <Badge colorPalette="gray">
            튜토리얼 퀘스트 · {ONBOARDING_QUESTS.length} / {ONBOARDING_QUESTS.length} 클리어
          </Badge>
        </VStack>
        <HStack gap="100" className="pt-250">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => router.replace(listPath)}
          >
            퀘스트 목록으로
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={() => router.push(toServerPath("/me/badges"))}
          >
            업적 도감 보기
          </Button>
        </HStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
