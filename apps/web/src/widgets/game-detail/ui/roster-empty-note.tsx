import { Text } from "@roll-and-call/ui";

interface RosterEmptyNoteProps {
  text: string;
}

export function RosterEmptyNote({ text }: RosterEmptyNoteProps) {
  return (
    <Text
      typography="body4"
      foreground="hint"
      render={<p />}
      className="rounded-400 border border-dashed border-gray-300 p-150 text-center"
    >
      {text}
    </Text>
  );
}
