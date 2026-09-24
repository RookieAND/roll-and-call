"use client";

import { Select } from "@roll-and-call/ui";

const PLACEHOLDER = "placeholder";

// Select는 클라이언트 모듈의 복합 객체라 서버 컴포넌트에서 Select.Root로 접근하면 undefined가 된다.
export function SkeletonSelect({ label }: { label: string }) {
  return (
    <Select.Root disabled value={PLACEHOLDER} items={[{ label, value: PLACEHOLDER }]}>
      <Select.Trigger className="whitespace-nowrap" />
    </Select.Root>
  );
}
