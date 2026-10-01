"use client";

import { compact } from "es-toolkit";
import { useContext } from "react";

import { FieldContext } from "./field-context";

export function useFieldControlAria({
  invalid,
  describedBy,
}: {
  invalid: boolean | null | undefined;
  describedBy?: string;
}) {
  const field = useContext(FieldContext);
  const describedByIds = compact([describedBy, field?.messageId]).join(" ");
  return {
    "aria-describedby": describedByIds || undefined,
    "aria-invalid": invalid || field?.invalid || undefined,
  };
}
