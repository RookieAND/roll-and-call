import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { isValidElement, type ComponentPropsWithRef, type ReactElement } from "react";

import { cn } from "./cn";

const button = cva(
  "inline-flex items-center justify-center gap-100 rounded-500 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-primary-600 text-white hover:bg-primary-700",
        discord:
          "bg-discord text-white shadow-[0_6px_18px_rgba(88,101,242,0.24)] hover:bg-discord-dark",
        confirm: "bg-success-solid text-white hover:bg-success-solid-hover",
        outline: "border border-gray-200 text-gray-600 hover:bg-gray-50",
        tinted: "border border-tinted-border bg-tinted-bg text-tinted-ink hover:bg-tinted-bg-hover",
        ghost: "text-gray-700 hover:bg-gray-100",
        danger: "border border-danger-200 text-danger-600 hover:bg-danger-50",
        // 되돌릴 수 없는 일을 확정하는 다이얼로그 버튼. 흰 글씨라 테마와 무관한 solid 토큰을 쓴다.
        destructive: "bg-danger-solid text-white hover:bg-danger-solid-hover",
      },
      size: {
        sm: "h-8 px-150 text-sm",
        md: "h-10 px-200 text-sm",
        lg: "h-12 px-300 text-heading3",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export interface ButtonProps extends ComponentPropsWithRef<"button">, VariantProps<typeof button> {
  loading?: boolean;
  asChild?: boolean;
}

export function Button({
  variant,
  size,
  className,
  type,
  loading,
  disabled,
  asChild,
  ref,
  children,
  ...props
}: ButtonProps) {
  const useAsChild = asChild && isValidElement(children);
  const classes = cn(
    button({ variant, size }),
    // ponytail: loading always reads as the muted-primary state from the 시안
    loading && "bg-primary-300 text-white hover:bg-primary-300",
    className,
  );

  return useRender({
    ref,
    defaultTagName: "button",
    render: useAsChild ? (children as ReactElement<Record<string, unknown>>) : undefined,
    props: useAsChild
      ? { className: classes, ...props }
      : {
          type: type ?? "button",
          disabled: disabled || loading,
          className: classes,
          ...props,
          children: (
            <>
              {loading && (
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/45 border-t-white"
                />
              )}
              {children}
            </>
          ),
        },
  });
}
