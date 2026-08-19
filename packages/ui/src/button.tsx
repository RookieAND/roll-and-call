import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { isValidElement, type ComponentPropsWithRef, type ReactElement } from "react";
import { cn } from "./cn";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-primary-600 text-white hover:bg-primary-700",
        discord:
          "bg-discord text-white shadow-[0_6px_18px_rgba(88,101,242,0.24)] hover:bg-discord-dark",
        confirm: "bg-success-600 text-white hover:bg-success-700",
        outline: "border border-gray-200 text-gray-600 hover:bg-gray-50",
        tinted:
          "border border-[#D5D3F7] bg-[#F5F4FF] text-primary-700 hover:bg-[#EEEDFC]",
        ghost: "text-gray-700 hover:bg-gray-100",
        danger: "border border-[#F0DADA] text-[#C33B3B] hover:bg-[#FEF5F5]",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-[15px]",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export type ButtonProps = ComponentPropsWithRef<"button"> &
  VariantProps<typeof button> & {
    loading?: boolean;
    /** Render the single child element (e.g. a Next Link) with button styling. */
    asChild?: boolean;
  };

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
    loading && "bg-[#A5A0EE] text-white hover:bg-[#A5A0EE]",
    className,
  );

  return useRender({
    ref,
    defaultTagName: "button",
    render: useAsChild
      ? (children as ReactElement<Record<string, unknown>>)
      : undefined,
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
