import { CERT_SELLERS } from "@roll-and-call/database/cert-sellers";
import { Field, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";
import { ShieldCheck } from "lucide-react";

import type { BookDraft } from "../model/book-draft";
import { OTHER_SELLER } from "../model/purchase-record";
import { OptionSelect } from "./option-select";

const SELLER_ITEMS = [
  ...CERT_SELLERS.map((seller) => ({ value: seller, label: seller })),
  { value: OTHER_SELLER, label: "기타 (직접 입력)" },
];

interface EbookFieldsProps {
  idPrefix: string;
  draft: BookDraft;
  onChange: (changes: Partial<BookDraft>) => void;
}

// 전자책의 판매처와 주문 정보. 구매 내역·영수증 사진과 함께 모두 필수다(주문일만 선택).
export function EbookFields({ idPrefix, draft, onChange }: EbookFieldsProps) {
  const setPurchase = (changes: Partial<BookDraft["purchase"]>) =>
    onChange({ purchase: { ...draft.purchase, ...changes } });
  return (
    <VStack gap="175">
      <Field.Root label="판매처" htmlFor={`${idPrefix}-seller`} required>
        <OptionSelect
          id={`${idPrefix}-seller`}
          placeholder="판매처를 골라 주세요"
          items={SELLER_ITEMS}
          value={draft.seller}
          onChange={(seller) => onChange({ seller })}
        />
        {draft.seller === OTHER_SELLER && (
          <TextInput
            maxLength={100}
            placeholder="판매처 이름"
            aria-label="판매처 이름"
            value={draft.sellerOther}
            onChange={(event) => onChange({ sellerOther: event.target.value })}
            className="mt-075"
          />
        )}
      </Field.Root>
      <HStack gap="100" className="[&>*]:min-w-0 [&>*]:flex-1">
        <Field.Root label="주문번호" htmlFor={`${idPrefix}-order-number`} required>
          <TextInput
            id={`${idPrefix}-order-number`}
            maxLength={100}
            placeholder="예: 20260912-0031"
            value={draft.purchase.orderNumber}
            onChange={(event) => setPurchase({ orderNumber: event.target.value })}
          />
        </Field.Root>
        <Field.Root label="주문일" htmlFor={`${idPrefix}-order-date`}>
          <TextInput
            id={`${idPrefix}-order-date`}
            maxLength={20}
            placeholder="예: 2026.09.12"
            value={draft.purchase.orderDate}
            onChange={(event) => setPurchase({ orderDate: event.target.value })}
          />
        </Field.Root>
      </HStack>
      <HStack align="start" gap="075">
        <ShieldCheck
          size={14}
          strokeWidth={2.1}
          aria-hidden
          className="mt-025 flex-none text-hint"
        />
        <Text typography="body4" foreground="hint">
          개인정보는 가리되, 주문번호는 보이게 올려 주세요.
        </Text>
      </HStack>
    </VStack>
  );
}
