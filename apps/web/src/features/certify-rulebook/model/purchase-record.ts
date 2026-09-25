// 구매 기록은 모두 선택이다. 사진만으로 확인하기 어려울 때 운영진이 참고한다.
export interface PurchaseRecord {
  captureUrl: string;
  orderNumber: string;
  orderDate: string;
}

export const EMPTY_PURCHASE: PurchaseRecord = { captureUrl: "", orderNumber: "", orderDate: "" };
