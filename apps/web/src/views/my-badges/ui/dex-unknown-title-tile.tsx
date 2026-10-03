import { Text, VStack } from "@roll-and-call/ui";

// 못 받은 숨겨진 칭호. 눌러도 아무것도 열지 않고, 이름·이모지·등급을 드러내지 않는다(R29).
export function DexUnknownTitleTile() {
  return (
    <VStack
      align="center"
      gap="100"
      role="img"
      aria-label="찾지 못한 칭호"
      className="rounded-500 border-[1.5px] border-dashed border-gray-300 px-025 pt-150 pb-125"
    >
      <Text
        typography="heading3"
        weight="extrabold"
        foreground="hint"
        aria-hidden
        className="flex size-12 items-center justify-center rounded-full border-2 border-dashed border-gray-300"
      >
        ?
      </Text>
      <Text typography="body4" weight="bold" foreground="hint" aria-hidden>
        ???
      </Text>
    </VStack>
  );
}
