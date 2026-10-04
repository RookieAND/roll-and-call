import { Button } from "@roll-and-call/ui";
import { Plus } from "lucide-react";

import { LoadingRegion, Panel, SkeletonTable } from "@/shared/ui";

import { PermissionPanel } from "./permission-panel";
import { SettingsFrame } from "./settings-frame";

export function SettingsStaffLoading() {
  return (
    <SettingsFrame title="운영진 관리" active="/settings/staff">
      <LoadingRegion label="운영진 목록을 불러오는 중입니다" className="gap-150">
        <Panel
          title="운영진"
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
              { label: "닉네임", kind: "text", width: 180 },
              { label: "역할", kind: "badge", width: 104 },
              { label: "추가한 날", kind: "date", width: 104 },
              { label: "최근 활동", kind: "date", width: 104 },
              { label: "", kind: "button", width: 150, align: "end" },
            ]}
          />
        </Panel>
        <PermissionPanel />
      </LoadingRegion>
    </SettingsFrame>
  );
}
