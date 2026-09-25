import { Button, Text } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import Link from "next/link";

import type { StaffCandidate, StaffRow } from "@/shared/server";
import { Panel } from "@/shared/ui";

import { PermissionTable } from "./permission-table";
import { SettingsFrame } from "./settings-frame";
import { StaffDialogs } from "./staff-dialogs";
import { StaffTable } from "./staff-table";

interface SettingsStaffViewProps {
  staff: StaffRow[];
  viewer: string;
  candidates: StaffCandidate[];
  removing?: StaffRow;
}

export function SettingsStaffView({ staff, viewer, candidates, removing }: SettingsStaffViewProps) {
  return (
    <SettingsFrame title="운영진 관리" active="/settings/staff">
      <Panel
        title="운영진"
        right={
          <Button
            size="sm"
            render={<Link href="/settings/staff?action=add" scroll={false} />}
            className="gap-050"
          >
            <Plus size={14} aria-hidden />
            운영진 추가
          </Button>
        }
        footer={
          <Text
            typography="body4"
            foreground="hint"
            className="border-t border-(--rc-color-border-subtle) px-175 py-125"
          >
            소유자의 역할은 변경하거나 해제할 수 없습니다.
          </Text>
        }
      >
        <StaffTable rows={staff} viewer={viewer} />
      </Panel>
      <Panel title="권한" bodyClassName="p-175">
        <PermissionTable />
      </Panel>
      <StaffDialogs candidates={candidates} removing={removing} />
    </SettingsFrame>
  );
}
