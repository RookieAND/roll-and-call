import { isNull } from "es-toolkit";

import { gameImagePathOf } from "./storage-path";

// 우리 구인 이미지 버킷 주소인가. 서버가 이 주소를 내려받아 디스코드에 올리므로 다른 주소는 받지 않는다.
export function isGameImageUrl(url: string) {
  return !isNull(gameImagePathOf(url));
}
