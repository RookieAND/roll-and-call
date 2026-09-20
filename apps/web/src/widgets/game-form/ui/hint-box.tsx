import { HStack, Text } from "@trpg/ui";
import { Fragment, type ReactNode } from "react";

interface HintBoxProps {
  icon?: ReactNode;
  lines: readonly string[];
}

export function HintBox({ icon, lines }: HintBoxProps) {
  return (
    <HStack
      align="start"
      gap="125"
      className="rounded-400 border border-gray-200 bg-gray-50 px-150 py-150"
    >
      {icon && <span className="mt-025 flex-none text-gray-500">{icon}</span>}
      <Text
        typography="body4"
        foreground="muted"
        render={<p />}
        className="min-w-0 flex-1 text-pretty leading-[1.7]"
      >
        {lines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Text>
    </HStack>
  );
}
