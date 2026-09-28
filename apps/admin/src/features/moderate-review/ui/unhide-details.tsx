import { Callout, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatShortDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { FactRows, PhotoThumb } from "@/shared/ui";

interface UnhideDetailsProps {
  review: ReviewDetail;
  hidden: NonNullable<ReviewDetail["hidden"]>;
}

export function UnhideDetails({ review, hidden }: UnhideDetailsProps) {
  const editedAfterHidden = review.editedAt && review.editedAt > hidden.at ? review.editedAt : null;
  return (
    <>
      {editedAfterHidden ? null : (
        <Callout.Root colorPalette="warning" size="sm">
          <Callout.Icon />
          <Callout.Description>숨긴 뒤 수정되지 않았습니다.</Callout.Description>
        </Callout.Root>
      )}
      <FactRows
        items={[
          { label: "숨긴 사유", value: hidden.reasonLabel },
          { label: "숨긴 시각", value: `${formatShortDateTime(hidden.at)} · ${hidden.by}` },
          {
            label: "작성자 수정",
            value: editedAfterHidden ? formatShortDateTime(editedAfterHidden) : "없음",
          },
        ]}
      />
      <Card.Root radius={400} padding="sm" render={<VStack gap="100" />}>
        <Text typography="body4" weight="bold" foreground="muted">
          지금 본문
        </Text>
        <Text typography="body3" className="whitespace-pre-line">
          {review.body}
        </Text>
        {review.photoUrls.length ? (
          <HStack gap="100" wrap>
            {review.photoUrls.map((url, index) => (
              <PhotoThumb
                key={url}
                url={url}
                label={`후기 사진 ${index + 1}/${review.photoUrls.length}`}
              />
            ))}
          </HStack>
        ) : null}
      </Card.Root>
    </>
  );
}
