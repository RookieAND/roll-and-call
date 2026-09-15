import { Text } from "@trpg/ui";

export function CapacityDivider({ maxPlayers }: { maxPlayers: number }) {
  return (
    <div className="flex items-center gap-2 border-y border-dashed border-tinted-border bg-tinted-bg px-3 py-1.5">
      <Text typography="body4" className="font-bold text-tinted-ink">
        정원 {maxPlayers}명
      </Text>
      <Text typography="body4" foreground="hint">
        여기까지 확정
      </Text>
    </div>
  );
}
