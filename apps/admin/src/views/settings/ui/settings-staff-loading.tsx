import { Button, Text } from "@roll-and-call/ui";
import { Plus } from "lucide-react";

import { LoadingRegion, Panel, SkeletonTable } from "@/shared/ui";

import { PermissionTable } from "./permission-table";
import { SettingsFrame } from "./settings-frame";

export function SettingsStaffLoading() {
  return (
    <SettingsFrame title="운영진 관리" active="/settings/staff">
      <LoadingRegion label="운영진 목록을 불러오는 중입니다" className="gap-150">
        <Panel
          title="운영진"
          footer={
            <Text
              typography="body4"
              foreground="hint"
              className="border-t border-(--rc-color-border-subtle) px-175 py-125"
            >
              소유자의 역할은 변경하거나 해제할 수 없습니다.
            </Text>
          }
          right={
            <Button size="sm" disabled className="gap-050">
              <Plus size={14} aria-hidden />
              운영진 추가
            </Button>
          }
        >
          <SkeletonTable
            rows={4}
            columns={[
              { label: "닉네임", kind: "text", width: "w-[180px]" },
              { label: "역할", kind: "badge", width: "w-[104px]", align: "center" },
              { label: "추가한 날", kind: "date", width: "w-[104px]" },
              { label: "최근 활동", kind: "date", width: "w-[104px]" },
              { label: "", kind: "empty" },
              { label: "", kind: "button", width: "w-[150px]", align: "end" },
            ]}
          />
        </Panel>
        <Panel title="권한" bodyClassName="p-175">
          <PermissionTable />
        </Panel>
      </LoadingRegion>
    </SettingsFrame>
  );
}
