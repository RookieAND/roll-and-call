export function fromKstDateTimeInput(value: string): Date {
  return new Date(`${value}:00+09:00`);
}
