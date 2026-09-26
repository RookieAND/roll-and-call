import { Select } from "@roll-and-call/ui";

interface OptionSelectProps {
  id: string;
  placeholder: string;
  items: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

// 목록에서 하나를 고르는 칸. 라벨은 감싸는 Field.Root가 id로 잇는다.
export function OptionSelect({ id, placeholder, items, value, onChange }: OptionSelectProps) {
  return (
    <Select.Root items={items} value={value} onValueChange={onChange}>
      <Select.Trigger id={id} placeholder={placeholder} className="h-11 w-full" />
      <Select.Popup>
        {items.map((item) => (
          <Select.Item key={item.value} value={item.value}>
            {item.label}
          </Select.Item>
        ))}
      </Select.Popup>
    </Select.Root>
  );
}
