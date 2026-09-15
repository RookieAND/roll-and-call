import { AppError } from "@/shared/api";

export const PARTICIPANT_NOT_FOUND_MESSAGE = "참여자를 찾을 수 없습니다.";

// 명단 변경을 거부할 때는 throw로 트랜잭션을 되돌리고, 그 문구와 표시 방식을 결과로 돌려준다.
export class RosterError extends AppError {}
