import {
  Checkbox,
  CheckboxGroup,
  HStack,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@roll-and-call/ui";

import { Tag } from "@/shared/ui";

const NONE_VALUE = "none";

interface CoveredBook {
  id: string;
  label: string;
}

interface CoveredBooksBoxProps {
  title: string;
  description: string;
  books: CoveredBook[];
  selectedIds: string[];
  // 하나만 고르는 칸이면 "연결 없음" 줄이 붙는다.
  single?: boolean;
  disabled?: boolean;
  onChange: (selectedIds: string[]) => void;
}

export function CoveredBooksBox({
  title,
  description,
  books,
  selectedIds,
  single,
  disabled,
  onChange,
}: CoveredBooksBoxProps) {
  const count = selectedIds.length;
  const rowClass = "min-h-[44px] w-full gap-100 border-t border-gray-200 px-150";
  const selectedRowClass = (selected: boolean) => (selected ? "bg-tinted-bg" : undefined);
  return (
    <VStack className="overflow-hidden rounded-300 border border-gray-200">
      <HStack justify="between" align="start" gap="125" className="px-150 py-125">
        <VStack gap="025">
          <Text typography="body4" weight="bold" id={`${title}-label`}>
            {title}
          </Text>
          <Text typography="body4" foreground="hint">
            {description}
          </Text>
        </VStack>
        <Tag tone={count > 0 ? "primary" : "gray"}>
          {count > 0 ? `${count}권 선택` : "선택 없음"}
        </Tag>
      </HStack>
      {single ? (
        <RadioGroup
          value={selectedIds[0] ?? NONE_VALUE}
          disabled={disabled}
          aria-labelledby={`${title}-label`}
          onValueChange={(next) => onChange(next === NONE_VALUE ? [] : [next as string])}
        >
          {[{ id: NONE_VALUE, label: "연결 없음" }, ...books].map((book) => (
            <Radio.Field
              key={book.id}
              className={`${rowClass} ${selectedRowClass(selectedIds.includes(book.id) || (count === 0 && book.id === NONE_VALUE)) ?? ""}`}
            >
              <Radio.Root value={book.id}>
                <Radio.Indicator />
              </Radio.Root>
              <Radio.Label>{book.label}</Radio.Label>
            </Radio.Field>
          ))}
        </RadioGroup>
      ) : (
        <CheckboxGroup.Root
          value={selectedIds}
          disabled={disabled}
          aria-labelledby={`${title}-label`}
          onValueChange={onChange}
        >
          {books.map((book) => (
            <Checkbox.Field
              key={book.id}
              className={`${rowClass} ${selectedRowClass(selectedIds.includes(book.id)) ?? ""}`}
            >
              <Checkbox.Root value={book.id}>
                <Checkbox.Indicator />
              </Checkbox.Root>
              <Checkbox.Label>{book.label}</Checkbox.Label>
            </Checkbox.Field>
          ))}
        </CheckboxGroup.Root>
      )}
    </VStack>
  );
}
