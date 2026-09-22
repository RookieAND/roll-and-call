import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface ErrorScreenProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function ErrorScreen({ title, description, action }: ErrorScreenProps) {
  return (
    <VStack gap="250" className="min-h-[70vh] items-center justify-center px-250 text-center">
      <Image src="/empty-states/empty-error.png" alt="" width={140} height={140} aria-hidden />
      <VStack gap="050" className="items-center">
        <Text typography="heading3">{title}</Text>
        {description && (
          <Text typography="body2" foreground="muted">
            {description}
          </Text>
        )}
      </VStack>
      <HStack gap="100">
        {action}
        <Button render={<Link href="/" />}>메인으로 돌아가기</Button>
      </HStack>
    </VStack>
  );
}
