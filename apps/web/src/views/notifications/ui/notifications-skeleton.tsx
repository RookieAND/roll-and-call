import { Container, Grid, HStack, Text } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

import { CountSkeleton } from "./count-skeleton";
import { InboxSkeleton } from "./inbox-skeleton";

const TAB_LABELS = ["할 일", "알림"] as const;

// 라우트 뼈대는 탭을 모르므로 기본 탭([알림])의 줄 뼈대를 그린다.
export function NotificationsSkeleton() {
  return (
    <>
      <AppBar title="알림" />
      <Grid cols={2} className="border-b border-gray-200">
        {TAB_LABELS.map((label) => (
          <HStack key={label} align="center" justify="center" gap="075" className="min-h-11">
            <Text typography="body2" weight="medium" foreground="muted">
              {label}
            </Text>
            <CountSkeleton />
          </HStack>
        ))}
      </Grid>
      <Container size="sm" className="px-0">
        <InboxSkeleton />
      </Container>
    </>
  );
}
