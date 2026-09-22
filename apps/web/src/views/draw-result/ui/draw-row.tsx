import { Avatar, Badge, HStack, Text, VStack } from "@trpg/ui";
import { cva } from "class-variance-authority";

import type { DrawEntry } from "../model/draw-entry";
import { DrawRollText } from "./draw-roll-text";

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
}

export function DrawRow({ entry, roll, emphasized, isMe }: DrawRowProps) {
  const nameWeight = emphasized || isMe ? "bold" : "medium";
  const nameForeground = isMe || emphasized ? "normal" : "muted";
  const strong = isMe || emphasized;

  let rollText = (
    <Text typography="body4" foreground="hint">
      직접 확정
    </Text>
  );
  if (roll !== null) {
    rollText = <DrawRollText value={roll} emphasized={emphasized} strong={strong} />;
  }

  return (
    <HStack align="center" gap="125" className={row({ emphasized })}>
      <Avatar src={entry.avatarUrl} name={entry.username} size={emphasized ? "md" : "sm"} />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text
          typography="body2"
          weight={nameWeight}
          foreground={nameForeground}
          truncate
          className="leading-[1.3]"
        >
          {entry.username}
        </Text>
        {entry.bio && (
          <Text typography="body4" foreground="hint" truncate className="leading-[1.3]">
            {entry.bio}
          </Text>
        )}
      </VStack>
      {isMe && <Badge color="primary">나</Badge>}
      {rollText}
    </HStack>
  );
}
