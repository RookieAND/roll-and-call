"use client";

import { Button, Sheet, Text, VStack } from "@roll-and-call/ui";

import { signInWithDiscord } from "../api/sign-in";

interface LoginSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  next?: string;
}

export function LoginSheet({ open, onOpenChange, next }: LoginSheetProps) {
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Overlay />
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Body>
          <VStack gap="200">
            <VStack gap="100">
              <Text typography="heading2">로그인하면 이어서 참여합니다</Text>
              <Text typography="body3" foreground="muted" className="[text-wrap:pretty]">
                {
                  "디스코드 계정으로 시작합니다.\n닉네임과 아바타만 가져옵니다.\n로그인 후 이 구인글로 돌아옵니다."
                }
              </Text>
            </VStack>
            <VStack gap="100">
              <Button
                colorPalette="discord"
                size="lg"
                className="w-full"
                onClick={() => signInWithDiscord(next)}
              >
                Discord로 로그인
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                먼저 둘러보기
              </Button>
            </VStack>
          </VStack>
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
