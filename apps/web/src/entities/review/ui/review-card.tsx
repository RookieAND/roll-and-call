"use client";

import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { ReviewBody } from "./review-body";
import { ReviewPhotos } from "./review-photos";
import { SpoilerCover } from "./spoiler-cover";

interface ReviewCardProps {
  title: string;
  meta: string;
  body: string;
  photoUrls: string[];
  spoiler: boolean;
  menu?: ReactNode;
}

export function ReviewCard({ title, meta, body, photoUrls, spoiler, menu }: ReviewCardProps) {
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
        <HStack align="start" gap="050">
          <VStack gap="025" className="min-w-0 flex-1">
            <Text typography="subtitle1" truncate render={<h3 />}>
              {title}
            </Text>
            <Text typography="body4" foreground="hint" numeric>
              {meta}
            </Text>
          </VStack>
          {menu}
        </HStack>
        {revealed ? (
          content
        ) : (
          <SpoilerCover onReveal={() => setRevealed(true)}>{content}</SpoilerCover>
        )}
      </VStack>
    </Card.Root>
  );
}
