import { Avatar, Badge, HStack, Text } from "@trpg/ui";
import { cva } from "class-variance-authority";

import type { DrawEntry } from "../model/draw-entry";
import { DrawRollText } from "./draw-roll-text";
import { RollingRollText } from "./rolling-roll-text";

const row = cva("border-t border-gray-100 px-175 first:border-t-0", {
  variants: {
    emphasized: { true: "min-h-[56px] py-100", false: "min-h-12 py-075" },
  },
});

interface DrawRowProps {
  entry: DrawEntry;
  roll: number | null;
  emphasized: boolean;
  isMe: boolean;
  // 주어지면 내 줄의 값이 처음 볼 때 한 번 굴러 멈춘다.
  rollingOnceKey?: string;
}

export function DrawRow({ entry, roll, emphasized, isMe, rollingOnceKey }: DrawRowProps) {
  const nameWeight = emphasized || isMe ? "bold" : "medium";
  const nameForeground = isMe || emphasized ? "normal" : "muted";
  const strong = isMe || emphasized;

  let rollText = (
    <Text typography="body4" foreground="hint">
      직접 확정
    </Text>
  );
  if (roll !== null && isMe && rollingOnceKey) {
    rollText = <RollingRollText roll={roll} onceKey={rollingOnceKey} emphasized={emphasized} />;
  } else if (roll !== null) {
    rollText = <DrawRollText value={roll} emphasized={emphasized} strong={strong} />;
  }

  return (
    <HStack align="center" gap="125" className={row({ emphasized })}>
      {emphasized && <Avatar src={entry.avatarUrl} name={entry.username} size="md" />}
      <Text
        typography="body2"
        weight={nameWeight}
        foreground={nameForeground}
        truncate
        className="min-w-0 flex-1"
      >
        {entry.username}
      </Text>
      {isMe && <Badge color="primary">나</Badge>}
      {rollText}
    </HStack>
  );
}
