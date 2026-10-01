import { FactRows, type FactRow } from "./fact-rows";

interface FactBoxProps {
  items: FactRow[];
}

export function FactBox({ items }: FactBoxProps) {
  return (
    <div className="rounded-400 border border-gray-200 bg-gray-50 px-175 py-050">
      <FactRows items={items} labelWidth={80} />
    </div>
  );
}
