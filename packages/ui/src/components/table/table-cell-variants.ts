import { cva } from "class-variance-authority";

export const tableCellVariants = cva(
  "h-11 border-b px-150 align-middle group-data-[size=sm]/table:h-9",
  {
    variants: {
      header: {
        true: "border-gray-200 text-body4 font-bold whitespace-nowrap text-gray-600",
        false: "border-gray-100",
      },
      align: { start: "text-left", center: "text-center", end: "text-right" },
      numeric: { true: "tabular-nums", false: "" },
    },
    defaultVariants: { header: false, align: "start", numeric: false },
  },
);
