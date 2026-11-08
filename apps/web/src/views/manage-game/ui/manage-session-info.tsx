import { Badge, Card, Text, VStack } from "@roll-and-call/ui";

import type { ManageSessionInfo as Info } from "../model/manage-session-info";
import { ManageInfoRow } from "./manage-info-row";

interface ManageSessionInfoProps {
  info: Info;
}

export function ManageSessionInfo({ info }: ManageSessionInfoProps) {
  return (
    <Card.Root padding="md" radius={600}>
      <Text typography="subtitle1" render={<h2 />} className="mb-050 block">
        세션 정보
      </Text>
      <VStack className="[&>*+*]:border-t [&>*+*]:border-gray-200">
        <ManageInfoRow label="세션 유형">
          <Badge colorPalette="gray">{info.kindLabel}</Badge>
        </ManageInfoRow>
        {info.review && (
          <>
            <ManageInfoRow label="작성된 후기">
              <Text typography="body3" weight="bold" numeric>
                {info.review.count}개
              </Text>
            </ManageInfoRow>
            <ManageInfoRow label="후기 마감">
              <Text typography="body3" weight="bold" numeric>
                {info.review.deadlineLabel}
              </Text>
            </ManageInfoRow>
          </>
        )}
      </VStack>
    </Card.Root>
  );
}
