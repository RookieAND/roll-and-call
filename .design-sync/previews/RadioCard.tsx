import { RadioCard, RadioGroup } from "@roll-and-call/ui";

export const RadioIndicator = () => (
  <RadioGroup
    name="recruit-method-card-radio"
    defaultValue="lottery"
    aria-label="모집 방식"
    className="flex flex-col gap-150"
  >
    <RadioCard.Root value="first-come" indicator="radio">
      <RadioCard.Title>선착순</RadioCard.Title>
      <RadioCard.Description>먼저 신청한 참여자부터 확정</RadioCard.Description>
      <RadioCard.Indicator />
    </RadioCard.Root>
    <RadioCard.Root value="lottery" indicator="radio">
      <RadioCard.Title>추첨</RadioCard.Title>
      <RadioCard.Description>마감 후 무작위로 확정</RadioCard.Description>
      <RadioCard.Indicator />
    </RadioCard.Root>
    <RadioCard.Root value="gm-approval" indicator="radio">
      <RadioCard.Title>GM 승인</RadioCard.Title>
      <RadioCard.Description>GM이 직접 참여자를 선택</RadioCard.Description>
      <RadioCard.Indicator />
    </RadioCard.Root>
  </RadioGroup>
);

export const CheckIndicator = () => (
  <RadioGroup
    name="recruit-method-card-check"
    defaultValue="gm-approval"
    aria-label="모집 방식 (체크)"
    className="flex flex-col gap-150"
  >
    <RadioCard.Root value="lottery" indicator="check">
      <RadioCard.Title>추첨</RadioCard.Title>
      <RadioCard.Description>마감 후 무작위로 확정</RadioCard.Description>
      <RadioCard.Indicator />
    </RadioCard.Root>
    <RadioCard.Root value="gm-approval" indicator="check">
      <RadioCard.Title>GM 승인</RadioCard.Title>
      <RadioCard.Description>GM이 직접 참여자를 선택</RadioCard.Description>
      <RadioCard.Indicator />
    </RadioCard.Root>
  </RadioGroup>
);

export const NoIndicatorWithMeta = () => (
  <RadioGroup
    name="recruit-method-card-meta"
    defaultValue="first-come"
    aria-label="모집 방식 (표시 없음)"
    className="flex flex-col gap-150"
  >
    <RadioCard.Root value="first-come" indicator="none">
      <RadioCard.Title>선착순</RadioCard.Title>
      <RadioCard.Description>먼저 신청한 참여자부터 확정</RadioCard.Description>
      <RadioCard.Meta>정원 4명 중 4명 신청</RadioCard.Meta>
    </RadioCard.Root>
    <RadioCard.Root value="lottery" indicator="none">
      <RadioCard.Title>추첨</RadioCard.Title>
      <RadioCard.Description>마감 후 무작위로 확정</RadioCard.Description>
      <RadioCard.Meta>정원 4명 중 2명 신청</RadioCard.Meta>
    </RadioCard.Root>
  </RadioGroup>
);
