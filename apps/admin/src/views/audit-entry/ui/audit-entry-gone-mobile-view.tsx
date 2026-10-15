import { Button } from "@roll-and-call/ui";

import { AdminHeader, EMPTY_IMAGE, EmptyState, MobileActionBar, ServerLink } from "@/shared/ui";

export function AuditEntryGoneMobileView() {
  return (
    <>
      <AdminHeader title="조치 상세" trail={[{ href: "/log", label: "활동 기록" }]} />
      <EmptyState
        image={EMPTY_IMAGE.search}
        title="보관 기간이 지나 삭제된 기록입니다"
        className="flex-1"
      />
      <MobileActionBar>
        <Button
          variant="outline"
          colorPalette="gray"
          size="lg"
          render={<ServerLink path="/log" />}
          className="text-body2"
        >
          활동 기록으로
        </Button>
      </MobileActionBar>
    </>
  );
}
