import type { ErrorDisplay } from "./error-display";

// error는 기본이 토스트다. errorDisplay가 page면 가까운 ErrorBoundary가 에러 화면을 띄운다.
export type ActionResult = {
  error?: string;
  errorDisplay?: ErrorDisplay;
  field?: string;
  redirect?: string;
};
