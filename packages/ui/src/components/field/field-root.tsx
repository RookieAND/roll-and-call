"use client";

import { useRender } from "@base-ui-components/react/use-render";
import { useId, type ReactNode } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateProps } from "../../lib/state-props";
import { FieldContext } from "./field-context";
import { FieldDescription } from "./field-description";
import { FieldError } from "./field-error";
import { FieldLabel } from "./field-label";

type FieldState = { invalid: boolean; required: boolean };

export interface FieldRootProps extends StateProps<FieldState> {
  label?: string;
  counter?: ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
}

export function FieldRoot({
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
}: FieldRootProps) {
  const state = { invalid: Boolean(error), required };
  const messageId = useId();
  return useRender({
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "field",
      className: cn("flex flex-col gap-075", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      children: (
        <FieldContext
          value={{
            messageId: error || description ? messageId : undefined,
            invalid: Boolean(error),
          }}
        >
          {(label || counter) && (
            <FieldLabel label={label} counter={counter} required={required} htmlFor={htmlFor} />
          )}
          {children}
          {error ? (
            <FieldError id={messageId} message={error} />
          ) : (
            description && <FieldDescription id={messageId} text={description} />
          )}
        </FieldContext>
      ),
    },
  });
}
