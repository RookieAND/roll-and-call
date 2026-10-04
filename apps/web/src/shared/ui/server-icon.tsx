import { cn, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import Image from "next/image";

const SIZES = {
  xs: { pixels: 16, className: "size-4 rounded-100", typography: "body5", textClassName: "" },
  sm: { pixels: 20, className: "size-5 rounded-200", typography: "body5", textClassName: "" },
  md: { pixels: 28, className: "size-7 rounded-300", typography: "subtitle2", textClassName: "" },
  xl: {
    pixels: 94,
    className: "size-[94px] rounded-800",
    typography: "heading1",
    textClassName: "text-[length:42px]",
  },
} as const;

const TONES = {
  muted: { className: "bg-gray-100", foreground: "muted" },
  primary: { className: "bg-primary-600", foreground: "onPrimary" },
} as const;

interface ServerIconProps {
  name: string;
  icon: string | null;
  size?: keyof typeof SIZES;
  // 아이콘이 없을 때 첫 글자 칸의 색
  tone?: keyof typeof TONES;
}

// 서버 아이콘이 없으면 이름 첫 글자를 쓴다. 디스코드 CDN 주소라 최적화를 거치지 않는다.
export function ServerIcon({ name, icon, size = "md", tone = "muted" }: ServerIconProps) {
  const { pixels, className, typography, textClassName } = SIZES[size];
  if (isNull(icon)) {
    const { className: toneClassName, foreground } = TONES[tone];
    return (
      <span
        aria-hidden
        className={cn("flex flex-none items-center justify-center", toneClassName, className)}
      >
        <Text
          typography={typography}
          weight="extrabold"
          foreground={foreground}
          tight
          className={textClassName}
        >
          {name.slice(0, 1)}
        </Text>
      </span>
    );
  }
  return (
    <Image
      src={icon}
      alt=""
      width={pixels}
      height={pixels}
      unoptimized
      className={cn("flex-none object-cover", className)}
    />
  );
}
