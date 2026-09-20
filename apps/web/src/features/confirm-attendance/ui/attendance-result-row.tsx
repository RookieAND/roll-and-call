import { Avatar, HStack, Text } from "@trpg/ui";

import type { Attendee } from "../model/attendee";
import { AbsentMark } from "./absent-mark";
import { PresentMark } from "./present-mark";

export function AttendanceResultRow({ attendee }: { attendee: Attendee }) {
  return (
    <HStack
      align="center"
      gap="125"
      className="min-h-14 border-t border-gray-100 px-150 py-100 first:border-t-0"
    >
      <Avatar src={attendee.avatarUrl} name={attendee.username} size="stack" />
      <Text truncate typography="subtitle2" className="min-w-0 flex-1">
        {attendee.username}
      </Text>
      {attendee.absent ? <AbsentMark /> : <PresentMark />}
    </HStack>
  );
}
