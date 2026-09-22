import { Text } from "@roll-and-call/ui";

interface RosterEmptyNoteProps {
  text: string;
}

export function RosterEmptyNote({ text }: RosterEmptyNoteProps) {
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
