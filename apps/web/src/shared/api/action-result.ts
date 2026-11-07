import type { ErrorDisplay } from "./error-display";

// error는 기본이 토스트다. errorDisplay가 page면 가까운 ErrorBoundary가 에러 화면을 띄운다.
// 막힌 행동(권한·기한·상태)은 warning, failed를 붙인 처리 실패만 danger 토스트다.
export type ActionResult = {
  error?: string;
  failed?: true;
  errorDisplay?: ErrorDisplay;
  field?: string;
};
