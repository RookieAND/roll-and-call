// drizzle은 Postgres 오류를 DrizzleQueryError로 감싸서 code가 cause에 있다.
export function isUniqueViolation(error: unknown, constraint: string) {
  const cause = (error as { cause?: { code?: string; constraint_name?: string } }).cause;
  return cause?.code === "23505" && cause.constraint_name === constraint;
}
