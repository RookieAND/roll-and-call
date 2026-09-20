export function FieldError({ message }: { message: string }) {
  return <p className="text-xs text-danger-600">{message}</p>;
}
