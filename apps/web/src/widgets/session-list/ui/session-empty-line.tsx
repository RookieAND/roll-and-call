import { Text } from "@trpg/ui";

export function SessionEmptyLine({ text }: { text: string }) {
  return (
    <div className="rounded-600 border border-dashed border-gray-300 p-175">
      <Text typography="body3" foreground="hint" render={<p />}>
        {text}
      </Text>
    </div>
  );
}
