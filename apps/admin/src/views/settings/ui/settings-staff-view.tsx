import { Button } from "@roll-and-call/ui";
import { Plus } from "lucide-react";

import type { StaffCandidate, StaffRow } from "@/shared/server";
import { Panel, ServerLink } from "@/shared/ui";

import { PermissionPanel } from "./permission-panel";
import { SettingsFrame } from "./settings-frame";
import { StaffDialogs } from "./staff-dialogs";
import { StaffTable } from "./staff-table";

interface SettingsStaffViewProps {
  staff: StaffRow[];
  viewerId: string;
  candidates: StaffCandidate[];
  removing?: StaffRow;
}

export function SettingsStaffView({
  staff,
  viewerId,
  candidates,
  removing,
}: SettingsStaffViewProps) {
  return (
    <SettingsFrame title="운영진 관리" active="/settings/staff">
      <Panel
        title="운영진"
        right={
          <Button
            size="sm"
            render={<ServerLink path="/settings/staff?action=add" scroll={false} />}
            className="gap-050"
          >
            <Plus size={14} aria-hidden />
            운영진 추가
          </Button>
        }
      >
        <StaffTable rows={staff} viewerId={viewerId} />
      </Panel>
      <PermissionPanel />
      <StaffDialogs candidates={candidates} removing={removing} />
    </SettingsFrame>
  );
}
