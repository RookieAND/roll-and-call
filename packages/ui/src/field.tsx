import { useRender } from "@base-ui-components/react/use-render";
import type { ReactNode } from "react";

import { cn } from "./cn";
import { FieldDescription } from "./field-description";
import { FieldError } from "./field-error";
import { FieldLabel } from "./field-label";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateProps } from "./state-props";

type FieldState = { invalid: boolean; required: boolean };

export interface FieldProps extends StateProps<FieldState> {
  label?: string;
  counter?: ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
}

export function Field({
  label,
  counter,
  description,
  error,
  required = false,
  htmlFor,
  className,
  style,
  render,
  children,
}: FieldProps) {
  const state = { invalid: Boolean(error), required };
  return useRender({
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "field",
      className: cn("flex flex-col gap-075", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      children: (
        <>
          {(label || counter) && (
            <FieldLabel label={label} counter={counter} required={required} htmlFor={htmlFor} />
          )}
          {children}
          {error ? (
            <FieldError message={error} />
          ) : (
            description && <FieldDescription text={description} />
          )}
        </>
      ),
    },
  });
}
