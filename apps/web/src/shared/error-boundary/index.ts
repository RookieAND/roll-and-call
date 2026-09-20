// next/error의 catchError는 CJS getter라 번들러 밖에서 named import가 안 된다. shared/ui 배럴에 두면 테스트가 깨지므로 따로 둔다.
export { ErrorBoundary } from "./error-boundary";
