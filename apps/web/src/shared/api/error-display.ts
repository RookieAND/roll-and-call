export const ERROR_DISPLAY = {
  toast: "toast",
  page: "page",
} as const;

export type ErrorDisplay = (typeof ERROR_DISPLAY)[keyof typeof ERROR_DISPLAY];

export const UNEXPECTED_ERROR_MESSAGE = "잠시 후 다시 시도해 주세요.";
