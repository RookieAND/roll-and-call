import type { NotificationPayload } from "@roll-and-call/database/notifications/model";
import { Callout, Card, Text, VStack } from "@roll-and-call/ui";
import { isNull, isUndefined } from "es-toolkit";

import { NotificationLine } from "./notification-line";

interface NotificationPreviewProps {
  payload: NotificationPayload | null;
  recipients?: string;
  emptyText?: string;
}

// 당사자가 서버 멤버이면 모든 조치 모달에 쓴다(D294). 문구는 사용자 앱 알림 줄과 같은 notificationText다.
export function NotificationPreview({
  payload,
  recipients,
  emptyText = "사유를 고르면 알림 미리보기가 표시됩니다.",
}: NotificationPreviewProps) {
  return (
    <Callout.Root colorPalette="gray" size="sm" className="mt-050">
      <VStack gap="100" className="col-start-2 min-w-0">
        <Text typography="body4" weight="bold" foreground="hint">
          당사자의 알림 탭에 이렇게 보입니다
        </Text>
        <Card.Root radius={400} padding="sm" background="subtle">
          {isNull(payload) ? (
            <Text typography="body3" foreground="hint">
              {emptyText}
            </Text>
          ) : (
            <NotificationLine payload={payload} />
          )}
        </Card.Root>
        {isUndefined(recipients) ? null : (
          <Text typography="body4" foreground="hint">
            {recipients}
          </Text>
        )}
      </VStack>
    </Callout.Root>
  );
}
