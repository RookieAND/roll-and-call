import { Text } from "@roll-and-call/ui";

interface KeyHintProps {
  keyLabel: string;
}

// 버튼 안에 붙는 단축키 표시. 글씨색은 버튼을 따른다.
export function KeyHint({ keyLabel }: KeyHintProps) {
  return (
    <Text
      typography="body4"
      weight="bold"
      foreground="inherit"
      render={<kbd />}
      aria-hidden
      className="ml-025 rounded-100 border border-current px-050 font-sans leading-[1.3] opacity-75"
    >
      {keyLabel}
    </Text>
  );
}
