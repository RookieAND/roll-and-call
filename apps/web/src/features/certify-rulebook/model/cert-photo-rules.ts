export const CERT_PHOTO_MAX_BYTES = 10 * 1024 * 1024;
// 아이폰은 JPG·PNG만 받는 입력에 HEIC 사진을 JPG로 바꿔 넘긴다. 어드민 브라우저가 HEIC를 못 그려서 이렇게 받는다.
export const CERT_PHOTO_ACCEPT = "image/jpeg,image/png";
