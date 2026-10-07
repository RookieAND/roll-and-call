import { Text, UiImage, VStack, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

export const EMPTY_IMAGE = {
  hosted: "empty-hosted",
  myGames: "empty-my-games",
  search: "empty-search",
  error: "empty-error",
  schedule: "empty-schedule",
  party: "empty-party",
} as const;
export type EmptyImage = (typeof EMPTY_IMAGE)[keyof typeof EMPTY_IMAGE];

interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  image?: EmptyImage;
  size?: "section" | "full";
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  image = EMPTY_IMAGE.hosted,
  size = "section",
  action,
  className,
}: EmptyStateProps) {
  const isFull = size === "full";
  const imagePx = isFull ? 168 : 128;
  return (
    <VStack
      align="center"
      justify="center"
      gap="150"
      className={cn("h-full px-250 py-300 text-center", className)}
    >
      <UiImage name={image} width={imagePx} height={imagePx} />
      <VStack align="center" gap="075" className={isFull ? "max-w-[440px]" : "max-w-[400px]"}>
        <Text typography={isFull ? "heading2" : "heading3"}>{title}</Text>
        {description ? (
          <Text
            typography={isFull ? "body2" : "body3"}
            foreground="muted"
            className="[text-wrap:pretty]"
          >
            {description}
          </Text>
        ) : null}
      </VStack>
      {action}
    </VStack>
  );
}
