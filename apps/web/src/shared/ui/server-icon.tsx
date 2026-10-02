import { cn, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import Image from "next/image";

const SIZES = {
  sm: { pixels: 20, className: "size-5 rounded-200", typography: "body5" },
  md: { pixels: 28, className: "size-7 rounded-300", typography: "subtitle2" },
  lg: { pixels: 64, className: "size-16 rounded-600", typography: "heading1" },
} as const;

interface ServerIconProps {
  name: string;
  icon: string | null;
  size?: keyof typeof SIZES;
}

// 서버 아이콘이 없으면 이름 첫 글자를 쓴다. 디스코드 CDN 주소라 최적화를 거치지 않는다.
export function ServerIcon({ name, icon, size = "md" }: ServerIconProps) {
  const { pixels, className, typography } = SIZES[size];
  if (isNull(icon)) {
    return (
      <span
        aria-hidden
        className={cn("flex flex-none items-center justify-center bg-gray-100", className)}
      >
        <Text typography={typography} weight="extrabold" foreground="muted" tight>
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
