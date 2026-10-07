import { Button, HStack, Text, UiImage, VStack, type UiAssetName } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { ServerLink } from "./server-link";

interface ErrorScreenProps {
  image?: UiAssetName;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  homeLink?: boolean;
}

export function ErrorScreen({
  image = "empty-error",
  title,
  description,
  action,
  homeLink = true,
}: ErrorScreenProps) {
  return (
    <VStack gap="250" className="min-h-[70vh] items-center justify-center px-250 text-center">
      <UiImage name={image} width={140} height={140} />
      <VStack gap="050" className="items-center">
        <Text typography="heading3">{title}</Text>
        {description && (
          <Text typography="body4" foreground="muted" className="[text-wrap:pretty]">
            {description}
          </Text>
        )}
      </VStack>
      <HStack gap="100">
        {action}
        {homeLink && <Button render={<ServerLink path="/" />}>메인으로 돌아가기</Button>}
      </HStack>
    </VStack>
  );
}
