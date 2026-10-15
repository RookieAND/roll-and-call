// 1100px 이상 모든 화면이 쓰는 한 가지 틀의 안쪽 폭: 본문 최대 960 + 간격 16 + 패널 320 = 1296px를 영역 가운데에 두고, 좁으면 양옆 16px를 남긴다.
export const FRAME_INNER_PX = "desktop:px-[max(1rem,calc((100%-1296px)/2))]";
export const FRAME_INNER_MX = "desktop:mx-[max(1rem,calc((100%-1296px)/2))]";
