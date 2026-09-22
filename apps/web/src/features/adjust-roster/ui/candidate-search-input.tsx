import { HStack, IconButton, TextInput } from "@roll-and-call/ui";
import { Search, X } from "lucide-react";

interface CandidateSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CandidateSearchInput({ value, onChange, disabled }: CandidateSearchInputProps) {
  return (
    <div role="search" className="relative">
      <Search
        size={16}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-150 -translate-y-1/2 text-hint"
      />
      <TextInput
        autoFocus={!disabled}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="닉네임 또는 디스코드 아이디"
        aria-label="참여자 찾기"
        enterKeyHint="search"
        className="h-[46px] pr-11 pl-11"
      />
      {value && (
        <HStack align="center" className="absolute inset-y-0 right-0">
          <IconButton
            variant="ghost"
            aria-label="검색어 지우기"
            className="h-11 w-11"
            onClick={() => onChange("")}
          >
            <X size={16} aria-hidden />
          </IconButton>
        </HStack>
      )}
    </div>
  );
}
