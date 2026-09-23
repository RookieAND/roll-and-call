import { useRender } from "@base-ui-components/react/use-render";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";
import { defaultColorPalette } from "../../tokens/default-color-palette";
import { ButtonLabel } from "./button-label";
import { buttonVariants } from "./button-variants";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonState = {
  variant: NonNullable<ButtonVariantProps["variant"]>;
  colorPalette: NonNullable<ButtonVariantProps["colorPalette"]>;
  size: NonNullable<ButtonVariantProps["size"]>;
  loading: boolean;
  disabled: boolean;
};

export interface ButtonProps extends StateComponentProps<"button", ButtonState> {
  variant?: ButtonState["variant"];
  colorPalette?: ButtonState["colorPalette"];
  // sm(32px)은 앱바 안처럼 좁은 자리 전용이다. 터치 주 액션에는 md 이상을 쓴다.
  size?: ButtonState["size"];
  loading?: boolean;
}

export function Button({
  variant = "solid",
  colorPalette,
  size = "md",
  className,
  style,
  type,
  loading = false,
  disabled = false,
  render,
  ref,
  children,
  ...props
}: ButtonProps) {
  const palette = colorPalette ?? defaultColorPalette(variant);
  const state = { variant, colorPalette: palette, size, loading, disabled: disabled || loading };
  return useRender({
    ref,
    defaultTagName: "button",
    render,
    state,
    stateAttributesMapping: { colorPalette: (value) => ({ "data-color-palette": String(value) }) },
    props: {
      "data-slot": "button",
      className: cn(
        buttonVariants({ variant, colorPalette: palette, size }),
        // ponytail: loading always reads as the muted-primary state from the 시안
        loading && "bg-primary-300 text-white hover:bg-primary-300",
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...(render ? {} : { type: type ?? "button", disabled: disabled || loading }),
      ...props,
      children: (
        <>
          {loading && (
            <span
              aria-hidden
              data-slot="button-spinner"
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/45 border-t-white"
            />
          )}
          <ButtonLabel>{children}</ButtonLabel>
        </>
      ),
    },
  });
}
