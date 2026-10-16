import { BANNER_RATIO } from "./banner-crop";

const TALLEST_STAGE_RATIO = 1.6;

// 자르는 마당을 이미지 모양에 맞춘다. 이미 3:1로 잘린 배너는 틀과 같은 크기라 위아래에 빈 회색이 생기지 않는다.
export function stageAspectRatio(natural: { width: number; height: number }) {
  return Math.min(BANNER_RATIO, Math.max(TALLEST_STAGE_RATIO, natural.width / natural.height));
}

// 이미지가 틀에 꼭 맞으면 확대하기 전에는 움직일 여유가 없다.
export function fitsFrameExactly(natural: { width: number; height: number }) {
  return Math.abs(natural.width / natural.height - BANNER_RATIO) < 0.02;
}
