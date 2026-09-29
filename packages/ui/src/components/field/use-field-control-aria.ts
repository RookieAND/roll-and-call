"use client";

import { useContext } from "react";

import { FieldContext } from "./field-context";

// Field.Root 안의 입력이 설명·오류 문구를 읽고, 오류가 있으면 invalid로 알린다.
export function useFieldControlAria(invalid: boolean | null | undefined, describedBy?: string) {
  const field = useContext(FieldContext);
  const describedByIds = [describedBy, field?.messageId].filter(Boolean).join(" ");
  return {
    "aria-describedby": describedByIds || undefined,
    "aria-invalid": invalid || field?.invalid || undefined,
  };
}
