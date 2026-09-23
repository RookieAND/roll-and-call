import { Button, HStack, IconButton, Popover, Text, VStack } from "@roll-and-call/ui";
import { Info } from "lucide-react";

export const HelpPopover = () => (
  <HStack align="center" gap="075" className="py-500">
    <Text typography="body4" foreground="muted">
      추첨 방식
    </Text>
    <Popover.Root defaultOpen>
      <Popover.Trigger render={<IconButton aria-label="추첨 방식 안내" />}>
        <Info size={16} aria-hidden />
      </Popover.Trigger>
      <Popover.Popup>
        <VStack gap="075">
          <Text typography="subtitle2">추첨은 이렇게 돌아갑니다</Text>
          <Text typography="body4" foreground="muted">
            마감 뒤 GM이 정원만큼 무작위로 뽑고, 뽑히지 않은 신청자는 대기 명단에 순서대로 남습니다.
          </Text>
        </VStack>
      </Popover.Popup>
    </Popover.Root>
  </HStack>
);

export const ConfirmPopover = () => (
  <HStack className="py-500">
    <Popover.Root defaultOpen>
      <Popover.Trigger render={<Button variant="outline" />}>확정 풀기</Popover.Trigger>
      <Popover.Popup side="bottom" align="start">
        <VStack gap="100">
          <Text typography="body4">달빛님의 확정을 풀면 대기 1번이 자동으로 올라갑니다.</Text>
          <HStack gap="100">
            <Popover.Close render={<Button variant="outline" size="sm" />}>취소</Popover.Close>
            <Button size="sm" colorPalette="danger">
              확정 풀기
            </Button>
          </HStack>
        </VStack>
      </Popover.Popup>
    </Popover.Root>
  </HStack>
);
