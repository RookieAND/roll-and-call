import { Text, VStack } from "@roll-and-call/ui";

interface ContentTextProps {
  lines: string[];
  empty: string;
}

export function ContentText({ lines, empty }: ContentTextProps) {
  return (
    <VStack gap="100" className="rounded-400 border border-gray-200 bg-gray-50 px-200 py-175">
      {lines.length ? (
        lines.map((line, index) => (
          <Text key={index} typography="body2" render={<p />} className="leading-[1.7]">
            {line}
          </Text>
        ))
      ) : (
        <Text typography="body2" foreground="hint" className="leading-[1.7]">
          {empty}
        </Text>
      )}
    </VStack>
  );
}
