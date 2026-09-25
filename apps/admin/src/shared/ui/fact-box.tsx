import { FactRows, type FactRow } from "./fact-rows";

interface FactBoxProps {
  items: FactRow[];
}

// 확정 직전 확인 창에서 무엇이 바뀌는지 한 번 더 보여 주는 상자.
export function FactBox({ items }: FactBoxProps) {
  return (
    <div className="rounded-400 border border-gray-200 bg-gray-50 px-175 py-050">
      <FactRows items={items} labelWidth={80} />
    </div>
  );
}
