import { Text } from "@trpg/ui";

import { formatDateTime } from "@/shared/lib";

// 터치에는 hover 툴팁이 없어서, 누른 칸의 명단을 격자 아래 카드로 보여준다.
export function PickedSlotCard({
  slotIso,
  names,
  gmName,
}: {
  slotIso: string;
  names: string[];
  gmName?: string;
}) {
  return (
    <div className="rounded-500 border border-gray-200 px-175 py-150" aria-live="polite">
      <Text typography="subtitle2" render={<p />}>
        {formatDateTime(slotIso)} · {names.length}명
      </Text>
      <Text typography="body4" foreground="muted" render={<p />} className="mt-025">
        {names.map((name) => (name === gmName ? `${name}(GM)` : name)).join(", ")}
      </Text>
    </div>
  );
}
