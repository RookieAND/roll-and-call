import { Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import Image from "next/image";

interface ServerIconProps {
  name: string;
  icon: string | null;
}

// 서버 아이콘이 없으면 이름 첫 글자를 쓴다. 디스코드 CDN 주소라 최적화를 거치지 않는다.
export function ServerIcon({ name, icon }: ServerIconProps) {
  if (isNull(icon)) {
    return (
      <span
        aria-hidden
        className="flex size-12 flex-none items-center justify-center rounded-500 bg-primary-50"
      >
        <Text typography="heading2" foreground="primary">
          {name.slice(0, 1)}
        </Text>
      </span>
    );
  }
  return (
    <Image
      src={icon}
      alt=""
      width={48}
      height={48}
      unoptimized
      className="size-12 flex-none rounded-500 object-cover"
    />
  );
}
