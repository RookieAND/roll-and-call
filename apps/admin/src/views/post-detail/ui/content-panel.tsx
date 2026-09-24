import { Badge, Grid, HStack, Text, VStack } from "@roll-and-call/ui";

import type { PostDetail } from "@/shared/server";

import { ImagePlaceholder } from "./image-placeholder";

interface ContentPanelProps {
  post: Pick<PostDetail, "synopsis" | "notices" | "imageUrls">;
}

// 시놉시스 → 안내 사항 → 본문 이미지. 스포일러는 가리지 않는다.
export function ContentPanel({ post }: ContentPanelProps) {
  return (
    <VStack gap="175" className="p-175">
      <VStack gap="100" render={<section />}>
        <Text typography="heading3" render={<h3 />}>
          시놉시스
        </Text>
        <Text
          typography="body2"
          foreground={post.synopsis ? "normal" : "hint"}
          className="max-w-[680px] leading-[1.75]"
        >
          {post.synopsis ?? "시놉시스가 없습니다"}
        </Text>
      </VStack>
      {post.notices.length ? (
        <VStack gap="100" render={<section />}>
          <Text typography="heading3" render={<h3 />}>
            안내 사항
          </Text>
          <VStack gap="050" render={<ul />}>
            {post.notices.map((notice) => (
              <HStack key={notice} gap="075" render={<li />}>
                <Text typography="body2" foreground="hint" aria-hidden>
                  ·
                </Text>
                <Text typography="body2" className="leading-[1.65]">
                  {notice}
                </Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      ) : null}
      {post.imageUrls.length ? (
        <VStack gap="100" render={<section />}>
          <HStack align="center" gap="075">
            <Text typography="heading3" render={<h3 />}>
              본문 이미지
            </Text>
            <Badge colorPalette="gray">{post.imageUrls.length}장</Badge>
          </HStack>
          <Grid className="grid-cols-2 gap-100">
            {post.imageUrls.map((url, index) =>
              url ? (
                <img
                  key={url}
                  src={url}
                  alt={`본문 이미지 ${index + 1}`}
                  className="h-[150px] w-full rounded-300 border border-gray-200 object-cover"
                />
              ) : (
                <ImagePlaceholder
                  key={index}
                  label={`본문 이미지 ${index + 1}`}
                  className="h-[150px]"
                />
              ),
            )}
          </Grid>
        </VStack>
      ) : null}
    </VStack>
  );
}
