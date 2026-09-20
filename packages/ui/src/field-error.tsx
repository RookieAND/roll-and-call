interface FieldErrorProps {
  message: string;
}

export function FieldError({ message }: FieldErrorProps) {
  return <p className="text-xs text-danger-600">{message}</p>;
}
