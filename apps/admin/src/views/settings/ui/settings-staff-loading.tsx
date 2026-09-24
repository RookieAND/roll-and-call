import { Button } from "@roll-and-call/ui";

import { LoadingRegion, Panel, SkeletonTable } from "@/shared/ui";

import { PermissionTable } from "./permission-table";
import { SettingsFrame } from "./settings-frame";

export function SettingsStaffLoading() {
  return (
    <SettingsFrame title="운영진 관리" active="/settings/staff">
      <LoadingRegion label="운영진 목록을 불러오는 중입니다" className="gap-150">
        <Panel
          title="운영진"
          right={
            <Button size="sm" disabled>
              운영진 추가
            </Button>
          }
        >
          <SkeletonTable
            rows={4}
            columns={[
              { label: "닉네임", kind: "text" },
              { label: "역할", kind: "badge", width: "w-[120px]" },
              { label: "추가한 날", kind: "date", width: "w-[150px]" },
              { label: "최근 활동", kind: "date", width: "w-[130px]" },
              { label: "", kind: "button", width: "w-[190px]", align: "end" },
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
