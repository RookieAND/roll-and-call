import { Button, Callout, Grid, Text, VStack } from "@roll-and-call/ui";

import { auditLogHref } from "@/entities/audit";
import {
  reviewListHref,
  REVIEW_LIST_TAB,
  type ReviewDetail,
  type ReviewListTab,
} from "@/entities/review";
import { REVIEW_ACTION, type ReviewAction } from "@/features/moderate-review";
import { formatDateTime, withQuery } from "@/shared/lib";
import {
  AdminHeader,
  KeyValueList,
  MobileActionBar,
  MobileSection,
  MobileTitle,
  ServerLink,
  Tag,
  ZoomablePhotos,
} from "@/shared/ui";

interface ReviewDetailMobileViewProps {
  review: ReviewDetail;
  tab: ReviewListTab;
  listQuery: Record<string, string | undefined>;
}

// 조치 시트(?action=)는 데스크톱 화면이 띄우는 ResponsiveDialog를 같이 쓴다.
export function ReviewDetailMobileView({ review, tab, listQuery }: ReviewDetailMobileViewProps) {
  const pathname = `/reviews/${review.id}`;
  const hiddenTab = tab === REVIEW_LIST_TAB.hidden;
  const query = { tab: hiddenTab ? tab : undefined, ...listQuery };
  const listHref = reviewListHref({ hidden: hiddenTab, query: listQuery });
  const actionHref = (action: ReviewAction) => withQuery(pathname, query, { action });
  const { author } = review;
  const actionSummary = author.receivedActionCount
    ? `받은 조치 ${author.receivedActionCount}회`
    : "받은 조치 없음";
  const primary = review.hidden ? (
    <Button render={<ServerLink path={actionHref(REVIEW_ACTION.unhide)} scroll={false} />}>
      숨김 해제
    </Button>
  ) : (
    <Button
      variant="outline"
      colorPalette="gray"
      render={<ServerLink path={actionHref(REVIEW_ACTION.hide)} scroll={false} />}
    >
      후기 숨기기
    </Button>
  );
  const moreItems = (
    <>
      <Button
        variant="outline"
        colorPalette="gray"
        render={<ServerLink path={`/users/${author.id}`} />}
      >
        작성자 유저 상세 열기
      </Button>
      <Button
        variant="outline"
        colorPalette="danger"
        render={<ServerLink path={actionHref(REVIEW_ACTION.remove)} scroll={false} />}
      >
        후기 제거
      </Button>
    </>
  );

  return (
    <>
      <AdminHeader
        title={<MobileTitle title="후기 상세" sub={author.nickname} />}
        trail={[{ href: listHref, label: hiddenTab ? "숨긴 후기" : "후기" }]}
      />
      <VStack gap="150" className="px-150 pt-150 pb-200">
        {review.hidden ? (
          <Callout.Root colorPalette="warning">
            <Callout.Icon />
            <Callout.Title>숨김 중인 후기입니다</Callout.Title>
            <Callout.Description>
              {formatDateTime(review.hidden.at)}에 {review.hidden.by}님이 숨겼습니다. 사유:{" "}
              {review.hidden.reason}
              {review.held ? " · 작성자가 불참으로 기록되어 해제해도 공개되지 않습니다." : null}
            </Callout.Description>
          </Callout.Root>
        ) : null}
        <MobileSection title="후기">
          <Text
            typography="body3"
            className="leading-[1.7] break-keep whitespace-pre-line [overflow-wrap:anywhere] [text-wrap:pretty]"
          >
            {review.body}
          </Text>
        </MobileSection>
        {review.photoUrls.length ? (
          <MobileSection title={`사진 ${review.photoUrls.length}장`}>
            <Grid className="grid-cols-3 gap-075">
              <ZoomablePhotos
                photos={review.photoUrls}
                title={author.nickname}
                subtitle={`${review.game.title} · ${formatDateTime(review.createdAt)}`}
                thumbLabel="후기 사진"
                spoiler={review.spoiler}
                className="aspect-square w-full"
              />
            </Grid>
          </MobileSection>
        ) : null}
        <MobileSection flush>
          <KeyValueList
            items={[
              { label: "작성자", value: author.isGm ? `${author.nickname} · GM` : author.nickname },
              { label: "구인", value: review.game.title },
              { label: "작성 시각", value: formatDateTime(review.createdAt) },
              {
                label: "수정 시각",
                value: review.editedAt ? formatDateTime(review.editedAt) : "수정하지 않음",
              },
              { label: "쓴 후기 · 받은 조치", value: `${author.reviewCount}개 · ${actionSummary}` },
              ...(review.spoiler ? [{ label: "스포일러", value: <Tag>스포일러 포함</Tag> }] : []),
              ...(review.hidden?.editedAfterHidden
                ? [{ label: "상태", value: <Tag>숨긴 뒤 수정됨</Tag> }]
                : []),
            ]}
          />
        </MobileSection>
        <Button
          variant="outline"
          colorPalette="gray"
          className="h-11"
          render={<ServerLink path={`/posts/${review.game.id}`} />}
        >
          구인 상세 열기
        </Button>
        <Button
          variant="outline"
          colorPalette="gray"
          className="h-11"
          render={
            <ServerLink
              path={auditLogHref({ targetUserId: author.id, targetGameId: review.game.id })}
            />
          }
        >
          활동 기록에서 보기
        </Button>
      </VStack>
      <MobileActionBar primary={primary} more={{ title: author.nickname, items: moreItems }} />
    </>
  );
}
