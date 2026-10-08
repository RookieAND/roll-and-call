import { Grid, Text, VStack } from "@roll-and-call/ui";

import type { PostDetail } from "@/shared/server";
import { FactRows, Tag, ZoomablePhotos } from "@/shared/ui";

import { ContentSection } from "./content-section";
import { ContentText } from "./content-text";

interface ContentPanelProps {
  post: Pick<
    PostDetail,
    | "title"
    | "rulebook"
    | "kindLabel"
    | "playTypeLabel"
    | "genres"
    | "triggers"
    | "platforms"
    | "aiImage"
    | "synopsis"
    | "notices"
    | "thumbnailUrl"
    | "imageUrls"
  >;
}

// 어드민에서는 스포일러를 가리지 않는다.
export function ContentPanel({ post }: ContentPanelProps) {
  const tagsOf = (values: string[]) =>
    values.length ? values.map((value) => <Tag key={value}>{value}</Tag>) : "없음";
  const aiImageBadge = post.aiImage ? <Tag tone="warning">사용</Tag> : <Tag>사용 안 함</Tag>;
  return (
    <VStack className="px-200">
      <ContentSection title="구인 설정">
        <VStack>
          <Grid className="grid-cols-2 items-start gap-x-400">
            <FactRows
              labelWidth={72}
              items={[
                { label: "유형", value: <Tag>{post.kindLabel}</Tag> },
                { label: "룰", value: post.rulebook },
              ]}
            />
            <FactRows
              labelWidth={72}
              items={[
                { label: "진행 방식", value: <Tag>{post.playTypeLabel}</Tag> },
                { label: "AI 이미지", value: aiImageBadge },
              ]}
            />
          </Grid>
          <FactRows
            labelWidth={72}
            items={[
              { label: "장르", value: tagsOf(post.genres) },
              { label: "트리거", value: tagsOf(post.triggers) },
              { label: "사용 플랫폼", value: tagsOf(post.platforms) },
            ]}
          />
        </VStack>
      </ContentSection>
      <ContentSection
        title="시놉시스"
        right={
          <Text typography="body4" foreground="hint">
            운영진 화면에서는 스포일러를 가리지 않습니다
          </Text>
        }
      >
        <ContentText
          lines={post.synopsis ? post.synopsis.split("\n").filter((line) => line.trim()) : []}
          empty="시놉시스가 없습니다"
        />
      </ContentSection>
      {post.notices.length ? (
        <ContentSection title="주의 사항">
          <ContentText lines={post.notices} empty="" />
        </ContentSection>
      ) : null}
      {post.thumbnailUrl ? (
        <ContentSection title="썸네일">
          <Grid className="grid-cols-2 gap-150">
            <ZoomablePhotos
              photos={[post.thumbnailUrl]}
              title={post.title}
              subtitle="썸네일"
              className="h-[150px] w-full"
            />
          </Grid>
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
