import { Stepper, VStack, Text } from "@roll-and-call/ui";

export const Default = () => (
  <VStack gap="075">
    <Text typography="body4" foreground="hint">
      모집 인원
    </Text>
    <Stepper value={4} min={1} max={8} onChange={() => {}} aria-label="모집 인원" />
  </VStack>
);

export const Invalid = () => (
  <VStack gap="075">
    <Text typography="body4" foreground="hint">
      모집 인원 (최소 인원 미만)
    </Text>
    <Stepper value={0} min={1} max={8} invalid onChange={() => {}} aria-label="모집 인원" />
  </VStack>
);

export const Boundaries = () => (
  <VStack gap="150">
    <VStack gap="075">
      <Text typography="body4" foreground="hint">
        최소값 (감소 버튼 비활성)
      </Text>
      <Stepper value={1} min={1} max={8} onChange={() => {}} aria-label="최소 인원" />
    </VStack>
    <VStack gap="075">
      <Text typography="body4" foreground="hint">
        최대값 (증가 버튼 비활성)
      </Text>
      <Stepper value={8} min={1} max={8} onChange={() => {}} aria-label="최대 인원" />
    </VStack>
  </VStack>
);

export const Disabled = () => (
  <VStack gap="075">
    <Text typography="body4" foreground="hint">
      확정된 모집 인원
    </Text>
    <Stepper value={6} min={1} max={8} disabled onChange={() => {}} aria-label="확정된 인원" />
  </VStack>
);
