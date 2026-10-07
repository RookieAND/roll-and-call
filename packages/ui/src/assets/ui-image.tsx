import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import { uiAssetUrl, type UiAssetName } from "./ui-asset";

interface UiImageProps extends Omit<ComponentProps<"img">, "src" | "width" | "height"> {
  name: UiAssetName;
  width: number;
  height: number;
}

// 테마 전환을 CSS에 맡긴다. JS로 고르면 첫 페인트에 반대 색이 번쩍인다.
// 안 보이는 쪽은 display:none이라 브라우저가 받지 않는다.
export function UiImage({ name, alt = "", className, loading = "lazy", ...props }: UiImageProps) {
  return (
    <>
      <img
        {...props}
        src={uiAssetUrl(name)}
        alt={alt}
        loading={loading}
        className={cn("dark:hidden", className)}
      />
      <img
        {...props}
        src={uiAssetUrl(name, "dark")}
        alt=""
        aria-hidden
        loading={loading}
        className={cn("hidden dark:block", className)}
      />
    </>
  );
}
