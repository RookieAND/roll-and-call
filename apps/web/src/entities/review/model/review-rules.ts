// 작성은 출석 확정부터, 수정은 등록부터 센다. 작성 기간은 database 패키지가 정한다.
export { REVIEW_WRITE_DAYS } from "@roll-and-call/database/games/model";
export const REVIEW_EDIT_DAYS = 7;
export const REVIEW_BODY_MIN_LENGTH = 20;
export const REVIEW_BODY_MAX_LENGTH = 2000;
export const REVIEW_PHOTO_MAX_COUNT = 5;
