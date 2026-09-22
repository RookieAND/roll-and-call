import { Checkbox } from "@roll-and-call/ui";

export const Unchecked = () => (
  <Checkbox.Field>
    <Checkbox.Root id="checkbox-unchecked">
      <Checkbox.Indicator />
    </Checkbox.Root>
    <Checkbox.Label>참여 규칙에 동의합니다</Checkbox.Label>
  </Checkbox.Field>
);

export const Checked = () => (
  <Checkbox.Field>
    <Checkbox.Root id="checkbox-checked" defaultChecked>
      <Checkbox.Indicator />
    </Checkbox.Root>
    <Checkbox.Label>참여 규칙에 동의합니다</Checkbox.Label>
  </Checkbox.Field>
);

export const Indeterminate = () => (
  <Checkbox.Field>
    <Checkbox.Root id="checkbox-indeterminate" indeterminate>
      <Checkbox.Indicator />
    </Checkbox.Root>
    <Checkbox.Label>전체 참여자 선택</Checkbox.Label>
  </Checkbox.Field>
);

export const Disabled = () => (
  <Checkbox.Field>
    <Checkbox.Root id="checkbox-disabled" disabled defaultChecked>
      <Checkbox.Indicator />
    </Checkbox.Root>
    <Checkbox.Label>마감된 세션 (수정 불가)</Checkbox.Label>
  </Checkbox.Field>
);
