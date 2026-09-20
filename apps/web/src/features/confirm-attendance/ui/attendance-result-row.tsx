import { Avatar, HStack, Text } from "@trpg/ui";
import { Check, X } from "lucide-react";

import type { Attendee } from "../model/attendee";

export function AttendanceResultRow({ attendee }: { attendee: Attendee }) {
  const Icon = attendee.absent ? X : Check;
  const foreground = attendee.absent ? "danger" : "success";
  const iconClass = attendee.absent ? "text-danger-600" : "text-success-700";

  return (
    <div className="flex min-h-14 items-center gap-125 border-t border-gray-100 px-150 py-100 first:border-t-0">
      <Avatar src={attendee.avatarUrl} name={attendee.username} size="stack" />
      <Text truncate typography="subtitle2" className="min-w-0 flex-1">
        {attendee.username}
      </Text>
      <HStack gap="050" align="center">
        <Icon size={14} strokeWidth={2.6} className={iconClass} />
        <Text typography="subtitle1" foreground={foreground}>
          {attendee.absent ? "불참" : "참석"}
        </Text>
      </HStack>
    </div>
  );
}
