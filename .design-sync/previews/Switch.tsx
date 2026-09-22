import { Switch } from "@roll-and-call/ui";

export const Off = () => (
  <Switch.Root id="switch-off">
    <Switch.Control />
    <Switch.Label>대기 접수 받기</Switch.Label>
  </Switch.Root>
);

export const On = () => (
  <Switch.Root id="switch-on" defaultChecked>
    <Switch.Control />
    <Switch.Label>썸네일 스포일러 처리</Switch.Label>
  </Switch.Root>
);

export const Disabled = () => (
  <Switch.Root id="switch-disabled" disabled defaultChecked>
    <Switch.Control />
    <Switch.Label>정원 자동 마감</Switch.Label>
  </Switch.Root>
);

export const Small = () => (
  <Switch.Root id="switch-small" size="sm" defaultChecked>
    <Switch.Control />
    <Switch.Label>다크 모드</Switch.Label>
  </Switch.Root>
);
