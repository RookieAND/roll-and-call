import type { CertFormat } from "./cert-format";

// 신청 화면의 번호 붙은 안내. 형식마다 세 줄.
export const CERT_GUIDE: Record<CertFormat, readonly string[]> = {
  physical: [
    "앞면은 디스코드 닉네임을 적은 쪽지와 함께 찍어 주세요.",
    "뒷면은 뒤표지 전체가 보이게 찍어 주세요.",
    "책등은 제목이 보이게 찍어 주세요.",
  ],
  ebook: [
    "구매 내역은 상품명과 결제 완료 상태가 보이게 올려 주세요.",
    "영수증은 상품명과 결제 금액이 보이게 올려 주세요.",
    "영수증은 이메일 캡처와 PDF 파일 모두 올릴 수 있습니다.",
  ],
};
