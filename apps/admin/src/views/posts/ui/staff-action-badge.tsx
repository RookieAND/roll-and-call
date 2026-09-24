import { Eye, FileText } from "lucide-react";

import type { PostStaffAction } from "@/shared/server";
import { IconBadge } from "@/shared/ui";

const ICON = { 숨김: Eye, "수정 요청": FileText } as const;

interface StaffActionBadgeProps {
  action: PostStaffAction;
}

export function StaffActionBadge({ action }: StaffActionBadgeProps) {
  return <IconBadge icon={ICON[action]}>{action}</IconBadge>;
}
