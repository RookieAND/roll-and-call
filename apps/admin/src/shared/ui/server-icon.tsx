import { cn, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import Image from "next/image";

const SIZES = {
  20: { className: "size-5 rounded-400", typography: "body4" },
  24: { className: "size-6 rounded-400", typography: "body4" },
  28: { className: "size-7 rounded-400", typography: "body3" },
  32: { className: "size-8 rounded-400", typography: "body3" },
  48: { className: "size-12 rounded-500", typography: "subtitle1" },
} as const;

interface ServerIconProps {
  name: string;
  icon: string | null;
  size?: keyof typeof SIZES;
}

// 디스코드 서버 아이콘. 아이콘이 없는 서버만 이름 첫 글자를 쓴다. 디스코드 CDN 주소라 최적화를 거치지 않는다.
export function ServerIcon({ name, icon, size = 32 }: ServerIconProps) {
  const { className, typography } = SIZES[size];
  if (isNull(icon)) {
    return (
      <Text
        typography={typography}
        weight="bold"
        foreground="muted"
        aria-hidden
        className={cn("grid flex-none place-items-center bg-gray-100", className)}
      >
        {name.slice(0, 1)}
      </Text>
    );
  }
  return (
    <Image
      src={icon}
      alt=""
      width={size}
      height={size}
      unoptimized
      className={cn("flex-none object-cover", className)}
    />
  );
}
