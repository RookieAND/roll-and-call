interface FieldErrorProps {
  message: string;
}

export function FieldError({ message }: FieldErrorProps) {
  return (
    <p data-slot="field-error" className="text-xs text-danger-600">
      {message}
    </p>
  );
}
