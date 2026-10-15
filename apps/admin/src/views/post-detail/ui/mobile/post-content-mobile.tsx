import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";

import type { PostDetail } from "@/entities/post/server";
import { KeyValueList, MobileSection, Tag, ZoomablePhotos } from "@/shared/ui";

interface PostContentMobileProps {
  post: PostDetail;
}

// 본문과 이미지는 신청자가 보는 화면과 같은 순서다. 어드민에서는 스포일러를 가리지 않는다.
export function PostContentMobile({ post }: PostContentMobileProps) {
  const tagsOf = (values: string[]) =>
    values.length ? (
      <HStack gap="050" wrap render={<span />}>
        {values.map((value) => (
          <Tag key={value}>{value}</Tag>
        ))}
      </HStack>
    ) : (
      "없음"
    );
  const synopsisLines = post.synopsis
    ? post.synopsis.split("\n").filter((line) => line.trim())
    : [];
  return (
    <VStack gap="150" className="px-150 pt-150 pb-200">
      <MobileSection title="구인 설정">
        <KeyValueList
          items={[
            { label: "유형", value: <Tag>{post.kindLabel}</Tag> },
            { label: "룰", value: post.rulebook },
            { label: "진행 방식", value: <Tag>{post.playTypeLabel}</Tag> },
            {
              label: "AI 이미지",
              value: post.aiImage ? <Tag tone="warning">사용</Tag> : <Tag>사용 안 함</Tag>,
            },
            { label: "장르", value: tagsOf(post.genres) },
            { label: "트리거", value: tagsOf(post.triggers) },
            { label: "사용 플랫폼", value: tagsOf(post.platforms) },
          ]}
        />
      </MobileSection>
      <MobileSection title="시놉시스">
        <Text
          typography="body3"
          foreground={synopsisLines.length ? "normal" : "hint"}
          className="leading-[1.7] break-keep whitespace-pre-line [overflow-wrap:anywhere] [text-wrap:pretty]"
        >
          {synopsisLines.length ? synopsisLines.join("\n") : "시놉시스가 없습니다"}
        </Text>
      </MobileSection>
      {post.notices.length ? (
        <MobileSection title="주의 사항">
          <Text
            typography="body3"
            className="leading-[1.7] break-keep whitespace-pre-line [text-wrap:pretty]"
          >
            {post.notices.join("\n")}
          </Text>
        </MobileSection>
      ) : null}
      {post.thumbnailUrl ? (
        <MobileSection title="썸네일">
          <Grid className="grid-cols-3 gap-075">
            <ZoomablePhotos
              photos={[post.thumbnailUrl]}
              title={post.title}
              subtitle="썸네일"
              className="aspect-square w-full"
            />
          </Grid>
        </MobileSection>
      ) : null}
      {post.imageUrls.length ? (
        <MobileSection title={`본문 이미지 ${post.imageUrls.length}장`}>
          <Grid className="grid-cols-3 gap-075">
            <ZoomablePhotos
              photos={post.imageUrls}
              title={post.title}
              subtitle="본문 이미지"
              className="aspect-square w-full"
            />
          </Grid>
        </MobileSection>
      ) : null}
    </VStack>
  );
}
