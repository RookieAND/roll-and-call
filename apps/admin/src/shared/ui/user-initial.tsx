import { Text } from "@roll-and-call/ui";

interface UserInitialProps {
  nickname: string;
}

export function UserInitial({ nickname }: UserInitialProps) {
  return (
    <Text
      typography="body2"
      weight="bold"
      foreground="muted"
      aria-hidden
      className="grid size-[40px] shrink-0 place-items-center rounded-full bg-gray-200"
    >
      {nickname.slice(0, 1)}
    </Text>
  );
}
