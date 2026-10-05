import { Grid, Text, VStack } from "@roll-and-call/ui";

import type { PostDetail } from "@/shared/server";
import { FactRows, Tag, ZoomablePhotos } from "@/shared/ui";

import { ContentSection } from "./content-section";

interface ContentPanelProps {
  post: Pick<
    PostDetail,
    "title" | "genres" | "triggers" | "platforms" | "aiImage" | "synopsis" | "notices" | "imageUrls"
  >;
}

// 어드민에서는 스포일러를 가리지 않는다.
export function ContentPanel({ post }: ContentPanelProps) {
  const tagsOf = (values: string[]) =>
    values.length ? values.map((value) => <Tag key={value}>{value}</Tag>) : "없음";
  const aiImageBadge = post.aiImage ? <Tag>사용</Tag> : <Tag>사용 안 함</Tag>;
  return (
    <VStack className="px-200">
      <ContentSection title="구인 설정">
        <FactRows
          items={[
            { label: "장르", value: tagsOf(post.genres) },
            { label: "트리거", value: tagsOf(post.triggers) },
            { label: "사용 플랫폼", value: tagsOf(post.platforms) },
            { label: "AI 이미지", value: aiImageBadge },
          ]}
        />
      </ContentSection>
      <ContentSection
        title="시놉시스"
        right={
          <Text typography="body4" foreground="hint">
            운영진 화면에서는 스포일러를 가리지 않습니다
          </Text>
        }
      >
        <Text
          typography="body2"
          foreground={post.synopsis ? "normal" : "hint"}
          className="rounded-400 border border-gray-200 bg-gray-50 px-200 py-175 leading-[1.7] whitespace-pre-line"
        >
          {post.synopsis ?? "시놉시스가 없습니다"}
        </Text>
      </ContentSection>
      {post.notices.length ? (
        <ContentSection title="주의 사항">
          <VStack gap="050" render={<ul />}>
            {post.notices.map((notice) => (
              <Text key={notice} typography="body2" render={<li />} className="leading-[1.65]">
                {notice}
              </Text>
            ))}
          </VStack>
        </ContentSection>
      ) : null}
      {post.imageUrls.length ? (
        <ContentSection
          title="본문 이미지"
          right={
            <Text typography="body4" foreground="hint">
              {post.imageUrls.length}장
            </Text>
          }
        >
          <Grid className="grid-cols-2 gap-150">
            <ZoomablePhotos
              photos={post.imageUrls}
              title={post.title}
              subtitle="본문 이미지"
              className="h-[150px] w-full"
            />
          </Grid>
        </ContentSection>
      ) : null}
    </VStack>
  );
}
