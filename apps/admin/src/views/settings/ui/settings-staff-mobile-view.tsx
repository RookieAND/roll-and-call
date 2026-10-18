import { Button, HStack, Text } from "@roll-and-call/ui";

import { formatFullDate, STAFF_ROLE_LABEL, withQuery } from "@/shared/lib";
import type { StaffRow } from "@/shared/server";
import { ListRow, MobileActionBar, ServerLink, StatusBadges, Tag } from "@/shared/ui";

import { formatLastActive } from "../model/format-last-active";
import { PERMISSION_NOTES } from "../model/permission-notes";
import { MobileSettingsFrame } from "./mobile/mobile-settings-frame";

interface SettingsStaffMobileViewProps {
  staff: StaffRow[];
  viewerId: string;
}

// 추가·해제 시트는 데스크톱 View의 StaffDialogs가 하나만 띄운다(두 View가 함께 그려져서 여기에 또 두면 겹친다).
export function SettingsStaffMobileView({ staff, viewerId }: SettingsStaffMobileViewProps) {
  return (
    <MobileSettingsFrame active="/settings/staff">
      <Text
        typography="body4"
        foreground="hint"
        render={<p />}
        className="border-b border-gray-200 bg-surface px-200 py-150 leading-normal"
      >
        {PERMISSION_NOTES[0]}
      </Text>
      {staff.map((row) => {
        const title = (
          <HStack align="center" gap="075" render={<span />}>
            {row.nickname}
            {row.userId === viewerId ? <Tag>나</Tag> : null}
          </HStack>
        );
        const trailing = <StatusBadges status={STAFF_ROLE_LABEL[row.role]} />;
        const description = row.since ? `추가한 날 ${formatFullDate(row.since)}` : "";
        const meta = row.lastActiveAt ? `최근 활동 ${formatLastActive(row.lastActiveAt)}` : null;
        if (row.role === "owner") {
          return (
            <ListRow
              key={row.userId}
              title={title}
              trailing={trailing}
              description={description}
              meta={meta}
            />
          );
        }
        return (
          <ListRow
            key={row.userId}
            path={withQuery("/settings/staff", {}, { action: "remove", staff: row.userId })}
            title={title}
            trailing={trailing}
            description={description}
            meta={meta}
          />
        );
      })}
      <Text typography="body4" foreground="hint" render={<p />} className="px-200 py-150">
        운영진 {staff.length}명
      </Text>
      <MobileActionBar>
        <Button
          size="lg"
          render={<ServerLink path="/settings/staff?action=add" scroll={false} />}
          className="text-body2"
        >
          운영진 추가
        </Button>
      </MobileActionBar>
    </MobileSettingsFrame>
  );
}
