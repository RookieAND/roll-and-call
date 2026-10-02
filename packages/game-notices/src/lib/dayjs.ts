// ponytail: 사용자 앱 shared/lib/dayjs.ts와 같은 설정을 복사해 둔다(날짜 문구 5개가 이 패키지 안에서만 쓰인다). 두 곳이 어긋나면 공용 날짜 패키지로 뺀다.
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
