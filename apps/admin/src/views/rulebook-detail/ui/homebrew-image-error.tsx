"use client";

import { Button, Text, VStack } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

// 서명하지 못한 이미지 자리만 회색 칸으로 바꾼다. 다시 읽으면 서명을 새로 받는다.
export function HomebrewImageError() {
  const router = useRouter();
  return (
    <VStack
      align="center"
      justify="center"
      gap="075"
      className="h-[150px] rounded-300 border border-gray-200 bg-gray-100 px-100 text-center"
    >
      <Text typography="body4" foreground="muted">
        이미지를 불러오지 못했습니다.
      </Text>
      <Button variant="ghost" colorPalette="gray" size="sm" onClick={() => router.refresh()}>
        <RotateCcw size={14} aria-hidden />
        다시 시도
      </Button>
    </VStack>
  );
}
