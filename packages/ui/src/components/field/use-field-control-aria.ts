"use client";

import { useContext } from "react";

import { FieldContext } from "./field-context";

export function useFieldControlAria(invalid: boolean | null | undefined, describedBy?: string) {
  const field = useContext(FieldContext);
  const describedByIds = [describedBy, field?.messageId].filter(Boolean).join(" ");
  return {
    "aria-describedby": describedByIds || undefined,
    "aria-invalid": invalid || field?.invalid || undefined,
  };
}
