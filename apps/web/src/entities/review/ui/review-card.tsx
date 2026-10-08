"use client";

import { Avatar, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { ReviewBody } from "./review-body";
import { ReviewPhotos } from "./review-photos";
import { SpoilerCover } from "./spoiler-cover";

interface ReviewCardProps {
  authorName: string;
  authorAvatarUrl: string | null;
  title: ReactNode;
  meta: ReactNode;
  body: string;
  photoUrls: string[];
  spoiler: boolean;
  menu?: ReactNode;
}

export function ReviewCard({
  authorName,
  authorAvatarUrl,
  title,
  meta,
  body,
  photoUrls,
  spoiler,
  menu,
}: ReviewCardProps) {
  const [revealed, setRevealed] = useState(!spoiler);
  const content = (
    <VStack gap="100">
      <ReviewBody body={body} />
      <ReviewPhotos urls={photoUrls} />
    </VStack>
  );

  return (
    <Card.Root padding="md" radius={500} render={<article />}>
      <VStack gap="125">
        <HStack align="center" gap="125">
          <Avatar src={authorAvatarUrl} name={authorName} size="md" />
          <VStack gap="025" className="min-w-0 flex-1">
            <Text typography="subtitle2" truncate render={<h3 />}>
              {title}
            </Text>
            <Text typography="body4" foreground="hint" truncate numeric>
              {meta}
            </Text>
          </VStack>
          {menu}
        </HStack>
        <div aria-hidden className="h-px bg-gray-200" />
        {revealed ? (
          content
        ) : (
          <SpoilerCover onReveal={() => setRevealed(true)}>{content}</SpoilerCover>
        )}
      </VStack>
    </Card.Root>
  );
}
