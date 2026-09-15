import { UNEXPECTED_ERROR_MESSAGE } from "@/shared/api";

export function uploadFailedMessage(reason: string = UNEXPECTED_ERROR_MESSAGE) {
  return `올리지 못했습니다. ${reason}`;
}
