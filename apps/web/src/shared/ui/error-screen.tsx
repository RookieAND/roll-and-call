import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, Text, VStack } from "@trpg/ui";

// 전역 에러/404 공용 화면: empty-error 에셋 + 안내 + 하단 "메인으로 돌아가기".
export function ErrorScreen({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <VStack gap={5} className="min-h-[70vh] items-center justify-center px-5 text-center">
      <Image src="/empty-states/empty-error.png" alt="" width={140} height={140} aria-hidden />
      <VStack gap={1} className="items-center">
        <Text typography="heading3">{title}</Text>
        {description && (
          <Text typography="body2" foreground="muted">
            {description}
          </Text>
        )}
      </VStack>
      <div className="flex gap-2">
        {action}
        <Button asChild>
          <Link href="/">메인으로 돌아가기</Link>
        </Button>
      </div>
    </VStack>
  );
}
