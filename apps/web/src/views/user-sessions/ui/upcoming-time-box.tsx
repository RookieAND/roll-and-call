import { Text, VStack, cn } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import { toKst } from "@/shared/lib";

import type { UpcomingRow } from "../model/upcoming-row";

const CLOCK_FORMAT = "HH:mm";

interface UpcomingTimeBoxProps {
  startsAt: UpcomingRow["startsAt"];
  endsAt: UpcomingRow["endsAt"];
}

export function UpcomingTimeBox({ startsAt, endsAt }: UpcomingTimeBoxProps) {
  const undated = isNull(startsAt);
  return (
    <VStack
      align="center"
      justify="center"
      gap="025"
      className={cn(
        "min-h-14 w-16 flex-none self-stretch rounded-500",
        undated ? "bg-gray-100" : "bg-tinted-bg",
      )}
    >
      {undated ? (
        <Text typography="subtitle2" foreground="hint">
          미정
        </Text>
      ) : (
        <>
          <Text typography="subtitle1" foreground="primary" numeric>
            {toKst(startsAt).format(CLOCK_FORMAT)}
          </Text>
          {endsAt && (
            <Text typography="body5" foreground="hint" numeric>
              ~ {toKst(endsAt).format(CLOCK_FORMAT)}
            </Text>
          )}
        </>
      )}
    </VStack>
  );
}
