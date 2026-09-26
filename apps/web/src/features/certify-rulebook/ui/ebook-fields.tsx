import { Field, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";
import { ShieldCheck } from "lucide-react";

import type { BookDraft } from "../model/book-draft";
import { OTHER_SELLER } from "../model/other-seller";
import { OptionSelect } from "./option-select";

interface EbookFieldsProps {
  idPrefix: string;
  sellers: string[];
  draft: BookDraft;
  onChange: (changes: Partial<BookDraft>) => void;
}

// 전자책의 판매처와 주문 정보. 주문번호만 선택이다.
export function EbookFields({ idPrefix, sellers, draft, onChange }: EbookFieldsProps) {
  const sellerItems = [
    ...sellers.map((seller) => ({ value: seller, label: seller })),
    { value: OTHER_SELLER, label: "기타 (직접 입력)" },
  ];
  return (
    <VStack gap="175">
      <Field.Root label="판매처" htmlFor={`${idPrefix}-seller`} required>
        <OptionSelect
          id={`${idPrefix}-seller`}
          placeholder="판매처를 골라 주세요"
          items={sellerItems}
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
        <Field.Root label="주문번호 (선택)" htmlFor={`${idPrefix}-order-number`}>
          <TextInput
            id={`${idPrefix}-order-number`}
            maxLength={100}
            placeholder="영수증에 있으면"
            value={draft.orderNumber}
            onChange={(event) => onChange({ orderNumber: event.target.value })}
          />
        </Field.Root>
        <Field.Root label="주문일" htmlFor={`${idPrefix}-order-date`} required>
          <TextInput
            id={`${idPrefix}-order-date`}
            maxLength={20}
            placeholder="예: 2026.09.12"
            value={draft.orderDate}
            onChange={(event) => onChange({ orderDate: event.target.value })}
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
          이름·주소·연락처·카드번호는 가려 주세요.
        </Text>
      </HStack>
    </VStack>
  );
}
