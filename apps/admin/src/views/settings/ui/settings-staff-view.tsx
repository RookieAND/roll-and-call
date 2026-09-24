import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { paginate } from "@/shared/lib";
import type { StaffCandidate, StaffRow } from "@/shared/server";
import { ListPager, Panel } from "@/shared/ui";

import { PermissionTable } from "./permission-table";
import { SettingsFrame } from "./settings-frame";
import { StaffDialogs } from "./staff-dialogs";
import { StaffTable } from "./staff-table";

interface SettingsStaffViewProps {
  staff: StaffRow[];
  viewer: string;
  candidates: StaffCandidate[];
  removing?: StaffRow;
  page?: string;
}

export function SettingsStaffView({
  staff,
  viewer,
  candidates,
  removing,
  page,
}: SettingsStaffViewProps) {
  const paged = paginate(staff, page);
  return (
    <SettingsFrame title="운영진 관리" active="/settings/staff">
      <Panel
        title="운영진"
        right={
          <Button size="sm" render={<Link href="/settings/staff?action=add" scroll={false} />}>
            운영진 추가
          </Button>
        }
        footer={
          <ListPager
            page={paged.page}
            totalPages={paged.totalPages}
            total={staff.length}
            unit="명"
          />
        }
      >
        <StaffTable rows={paged.rows} viewer={viewer} />
      </Panel>
      <Panel title="권한" bodyClassName="p-175">
        <PermissionTable />
      </Panel>
      <StaffDialogs candidates={candidates} removing={removing} />
    </SettingsFrame>
  );
}
