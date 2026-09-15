import { Text, cn } from "@trpg/ui";

export function Legend({
  label,
  swatchClass,
  swatchStyle,
}: {
  label: string;
  swatchClass?: string;
  swatchStyle?: React.CSSProperties;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className={cn("inline-block size-3.5 rounded-[3px] border border-gray-200", swatchClass)}
        style={swatchStyle}
      />
      <Text typography="body4" foreground="muted" render={<span />}>
        {label}
      </Text>
    </span>
  );
}
