import type { CertProof } from "./cert-proof";
import type { CertShot } from "./cert-shot";

// 누른 칸 아래 한 줄 안내.
export const CERT_GUIDE: Record<CertShot | CertProof, string> = {
  front: "앞면: 표지 전체와 닉네임 쪽지가 함께 보이게 찍어 주세요.",
  back: "뒷면: 뒤표지 전체가 보이게 찍어 주세요.",
  side: "책등: 제목이 보이게 찍어 주세요.",
  order: "구매 내역: 상품명·주문번호·주문일·결제 상태가 보여야 합니다.",
  receipt: "영수증: 상품명과 결제 금액이 보여야 합니다. PDF도 받습니다.",
};
