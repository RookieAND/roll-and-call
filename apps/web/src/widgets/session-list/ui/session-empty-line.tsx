import { Text } from "@roll-and-call/ui";

interface SessionEmptyLineProps {
  text: string;
}

export function SessionEmptyLine({ text }: SessionEmptyLineProps) {
  return (
    <div className="rounded-600 border border-dashed border-gray-300 p-175">
      <Text typography="body3" foreground="hint" render={<p />}>
        {text}
      </Text>
    </div>
  );
}
