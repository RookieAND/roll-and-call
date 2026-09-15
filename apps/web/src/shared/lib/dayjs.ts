import dayjs from "dayjs";
import "dayjs/locale/ko";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

// 서버(Vercel)는 UTC라 날짜 계산은 항상 이 타임존을 명시해서 한다.
export const KST = "Asia/Seoul";

export { dayjs };
