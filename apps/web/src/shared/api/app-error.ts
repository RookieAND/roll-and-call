import { ERROR_DISPLAY, type ErrorDisplay } from "./error-display";

// 서버 컴포넌트·서버 액션에서 throw한 에러는 프로덕션에서 메시지가 지워지므로, 이 클래스는 클라이언트에서 던질 때만 문구가 살아남는다.
export class AppError extends Error {
  readonly display: ErrorDisplay;

  constructor(message: string, display: ErrorDisplay = ERROR_DISPLAY.toast) {
    super(message);
    this.name = "AppError";
    this.display = display;
  }
}
