import { cva } from "class-variance-authority";

// variant는 모양, colorPalette는 색이다. 두 축을 곱해 한 벌씩 정한다.
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-100 rounded-500 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: { solid: "", outline: "border", tinted: "border", ghost: "" },
      colorPalette: { primary: "", success: "", danger: "", warning: "", gray: "", discord: "" },
      size: {
        sm: "h-8 px-150 text-sm",
        md: "h-10 px-200 text-sm",
        lg: "h-12 px-300 text-heading3",
      },
    },
    compoundVariants: [
      // success·danger 면은 다크에서 밝아지므로 글씨는 inverse가 맡는다.
      {
        variant: "solid",
        colorPalette: "primary",
        className: "bg-primary-600 text-white hover:bg-primary-700",
      },
      {
        variant: "solid",
        colorPalette: "success",
        className: "bg-success-solid text-inverse hover:opacity-90",
      },
      {
        variant: "solid",
        colorPalette: "danger",
        className: "bg-danger-solid text-inverse hover:opacity-90",
      },
      {
        variant: "solid",
        colorPalette: "warning",
        className: "bg-warning-600 text-surface hover:opacity-90",
      },
      {
        variant: "solid",
        colorPalette: "gray",
        className: "bg-gray-900 text-surface hover:opacity-90",
      },
      {
        variant: "solid",
        colorPalette: "discord",
        className:
          "bg-discord text-white shadow-[0_6px_18px_rgba(88,101,242,0.24)] hover:bg-discord-dark",
      },
      {
        variant: "outline",
        colorPalette: "primary",
        className: "border-tinted-border text-tinted-ink hover:bg-tinted-bg",
      },
      {
        variant: "outline",
        colorPalette: "success",
        className: "border-success-200 text-success-700 hover:bg-success-50",
      },
      {
        variant: "outline",
        colorPalette: "danger",
        className: "border-danger-200 text-danger-600 hover:bg-danger-50",
      },
      {
        variant: "outline",
        colorPalette: "warning",
        className: "border-notice-border text-warning-600 hover:bg-warning-50",
      },
      {
        variant: "outline",
        colorPalette: "gray",
        className: "border-gray-200 text-gray-600 hover:bg-gray-50",
      },
      {
        variant: "outline",
        colorPalette: "discord",
        className: "border-discord text-discord hover:bg-gray-50",
      },
      {
        variant: "tinted",
        colorPalette: "primary",
        className: "border-tinted-border bg-tinted-bg text-tinted-ink hover:bg-tinted-bg-hover",
      },
      {
        variant: "tinted",
        colorPalette: "success",
        className: "border-success-200 bg-success-100 text-success-700 hover:bg-success-50",
      },
      {
        variant: "tinted",
        colorPalette: "danger",
        className: "border-danger-200 bg-danger-50 text-danger-600 hover:bg-danger-100",
      },
      {
        variant: "tinted",
        colorPalette: "warning",
        className: "border-notice-border bg-warning-50 text-warning-600",
      },
      {
        variant: "tinted",
        colorPalette: "gray",
        className: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200",
      },
      {
        variant: "tinted",
        colorPalette: "discord",
        className: "border-transparent bg-gray-100 text-discord hover:bg-gray-200",
      },
      {
        variant: "ghost",
        colorPalette: "primary",
        className: "text-tinted-ink hover:bg-tinted-bg",
      },
      {
        variant: "ghost",
        colorPalette: "success",
        className: "text-success-700 hover:bg-success-50",
      },
      { variant: "ghost", colorPalette: "danger", className: "text-danger-600 hover:bg-danger-50" },
      {
        variant: "ghost",
        colorPalette: "warning",
        className: "text-warning-600 hover:bg-warning-50",
      },
      { variant: "ghost", colorPalette: "gray", className: "text-gray-700 hover:bg-gray-100" },
      { variant: "ghost", colorPalette: "discord", className: "text-discord hover:bg-gray-100" },
    ],
    defaultVariants: { variant: "solid", size: "md" },
  },
);
