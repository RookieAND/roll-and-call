import { Chip, Text, cn } from "@trpg/ui";

import { SLOT_PRESETS } from "@/entities/profile";

// 세션별 응답과 섞이면 GM이 잘못 읽으므로 프로필 기본값임을 밝힌다.
export function UsualAvailability({ slots }: { slots: string[] | null }) {
  const selectedKeys: readonly string[] = slots ?? [];
  const hasSlots = SLOT_PRESETS.some((preset) => selectedKeys.includes(preset.key));

  return (
    <section className="p-4">
      <Text
        typography="subtitle2"
        foreground="muted"
        render={<h2 />}
        className="mb-2 text-[12.5px]"
      >
        보통 가능한 시간
      </Text>
      {hasSlots ? (
        <>
          <div className="flex flex-wrap gap-1.5">
            {SLOT_PRESETS.map((preset) => {
              const selected = selectedKeys.includes(preset.key);
              const chipClass = cn(
                "pointer-events-none h-[34px] px-3 text-[13px]",
                selected ? "font-bold" : "text-hint",
              );
              return (
                <Chip key={preset.key} asChild selected={selected} className={chipClass}>
                  <span>{preset.label}</span>
                </Chip>
              );
            })}
          </div>
          <Text typography="body4" foreground="hint" render={<p />} className="mt-[9px]">
            프로필 기본값입니다.
          </Text>
        </>
      ) : (
        <div className="rounded-[11px] border border-dashed border-gray-300 px-3.5 py-[13px]">
          <Text typography="body3" foreground="hint" render={<p />}>
            적어두지 않았습니다.
          </Text>
        </div>
      )}
    </section>
  );
}
