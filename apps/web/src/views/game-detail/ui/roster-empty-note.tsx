import { Text } from "@trpg/ui";

export function RosterEmptyNote({ text }: { text: string }) {
  return (
    <Text
      typography="body3"
      foreground="muted"
      render={<p />}
      className="rounded-700 border border-dashed border-gray-300 p-200 text-center"
    >
      {text}
    </Text>
  );
}
