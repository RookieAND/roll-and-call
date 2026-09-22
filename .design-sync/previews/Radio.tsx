import { Radio, RadioGroup } from "@roll-and-call/ui";

export const RecruitMethod = () => (
  <RadioGroup name="recruit-method" aria-label="모집 방식" className="flex flex-col gap-150">
    <Radio.Field>
      <Radio.Root value="first-come">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>선착순</Radio.Label>
    </Radio.Field>
    <Radio.Field>
      <Radio.Root value="lottery">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>추첨</Radio.Label>
    </Radio.Field>
    <Radio.Field>
      <Radio.Root value="gm-approval">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>GM 승인</Radio.Label>
    </Radio.Field>
  </RadioGroup>
);

export const Selected = () => (
  <RadioGroup
    name="recruit-method-selected"
    defaultValue="lottery"
    aria-label="모집 방식 (선택됨)"
    className="flex flex-col gap-150"
  >
    <Radio.Field>
      <Radio.Root value="first-come">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>선착순</Radio.Label>
    </Radio.Field>
    <Radio.Field>
      <Radio.Root value="lottery">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>추첨</Radio.Label>
    </Radio.Field>
    <Radio.Field>
      <Radio.Root value="gm-approval">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>GM 승인</Radio.Label>
    </Radio.Field>
  </RadioGroup>
);

export const Disabled = () => (
  <RadioGroup
    name="recruit-method-disabled"
    defaultValue="gm-approval"
    disabled
    aria-label="모집 방식 (비활성)"
    className="flex flex-col gap-150"
  >
    <Radio.Field>
      <Radio.Root value="first-come">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>선착순</Radio.Label>
    </Radio.Field>
    <Radio.Field>
      <Radio.Root value="gm-approval">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>GM 승인</Radio.Label>
    </Radio.Field>
  </RadioGroup>
);
