import { Text, VStack } from "@roll-and-call/ui";
import { chunk } from "es-toolkit";

interface HelpStepBodyProps {
  lines: string[];
}

const SPLIT_FROM = 4;

export function HelpStepBody({ lines }: HelpStepBodyProps) {
  const groupSize = lines.length >= SPLIT_FROM ? Math.ceil(lines.length / 2) : lines.length;
  const groups = chunk(lines, groupSize);

  return (
    <VStack gap="100">
      {groups.map((group, groupIndex) => (
        <p key={groupIndex} className="text-pretty">
          {group.map((line, lineIndex) => {
            const lead = groupIndex === 0 && lineIndex === 0;
            return (
              <Text
                key={line}
                typography="body3"
                weight={lead ? "bold" : undefined}
                foreground={lead ? "normal" : "muted"}
                render={<span />}
                className="block"
              >
                {line}
              </Text>
            );
          })}
        </p>
      ))}
    </VStack>
  );
}
