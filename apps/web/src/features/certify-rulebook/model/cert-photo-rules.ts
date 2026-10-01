export const CERT_PHOTO_MAX_BYTES = 10 * 1024 * 1024;
// 아이폰은 JPG·PNG만 받는 입력에 HEIC 사진을 JPG로 바꿔 넘긴다. 어드민 브라우저가 HEIC를 못 그려서 이렇게 받는다.
export const CERT_PHOTO_ACCEPT = "image/jpeg,image/png";
export const CERT_RECEIPT_ACCEPT = `${CERT_PHOTO_ACCEPT},application/pdf`;
// 심사 때 책 표지·판권 글자를 읽어야 해서 다른 사진보다 크게 남긴다.
export const CERT_PHOTO_MAX_SIDE = 2400;
