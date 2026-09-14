import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";
import { Tooltip } from "./tooltip";

const avatar = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold",
  {
    variants: {
      size: {
        sm: "h-6 w-6 text-[10px]",
        md: "h-8 w-8 text-xs",
        stack: "h-[34px] w-[34px] text-[13px]",
        lg: "h-12 w-12 text-sm",
        xl: "h-[52px] w-[52px] text-lg",
        "2xl": "h-[60px] w-[60px] text-xl",
        "3xl": "h-[84px] w-[84px] text-2xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);

// Deterministic bg/fg pair per name — mirrors the 시안's colored initial avatars.
const palette: readonly [string, string][] = [
  ["#E0E7FF", "#4338CA"],
  ["#FFE7D6", "#B4531B"],
  ["#DDF3E8", "#0B7A55"],
  ["#EDE2FB", "#6B3FA0"],
  ["#FBE2EC", "#A03F6B"],
  ["#E2F0FB", "#2C6BA0"],
];

function colorFor(name: string): [string, string] {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length]!;
}

export type AvatarProps = VariantProps<typeof avatar> & {
  src?: string | null;
  name?: string | null;
  className?: string;
};

export function Avatar({ src, name, size, className }: AvatarProps) {
  const trimmed = (name ?? "").trim();
  const initial = trimmed.charAt(0) || "?";
  const [bg, fg] = trimmed ? colorFor(trimmed) : ["#EAEAEF", "#8A8A95"];
  const face = (
    <span
      className={cn(avatar({ size }), className)}
      style={src ? undefined : { backgroundColor: bg, color: fg }}
    >
      {src ? (
        // plain img: Discord CDN avatars, no next/image remote config needed
        <img src={src} alt={name ?? ""} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );

  // 이름이 있으면 hover 시 툴팁으로 보여준다.
  if (!trimmed) return face;
  return <Tooltip content={trimmed}>{face}</Tooltip>;
}

export type AvatarPerson = { src?: string | null; name?: string | null };

export type AvatarGroupProps = VariantProps<typeof avatar> & {
  people: AvatarPerson[];
  max?: number;
  className?: string;
};

export function AvatarGroup({ people, max = 3, size, className }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  // +N 칩은 가려진 사람들의 이름을 툴팁으로 보여준다.
  const hiddenNames = people
    .slice(max)
    .map((p) => p.name?.trim())
    .filter(Boolean)
    .join(", ");
  return (
    <div className={cn("flex items-center", className)}>
      {shown.map((p, i) => (
        <span key={i} className="-ml-2 inline-flex rounded-full ring-2 ring-surface first:ml-0">
          <Avatar src={p.src} name={p.name} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <Tooltip content={hiddenNames || `${extra}명 더`}>
          <span
            className={cn(avatar({ size }), "-ml-2 bg-gray-100 text-gray-600 ring-2 ring-surface")}
          >
            +{extra}
          </span>
        </Tooltip>
      )}
    </div>
  );
}
